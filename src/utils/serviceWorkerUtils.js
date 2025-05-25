// Offline audio functionality using IndexedDB

// Utility function to ensure HTTPS URLs when app is served over HTTPS
const ensureHttpsUrl = (url) => {
  // If the current page is HTTPS and the URL is HTTP, convert it to HTTPS
  if (window.location.protocol === 'https:' && url.startsWith('http:')) {
    return url.replace('http:', 'https:');
  }
  return url;
};

// Initialize IndexedDB
const initializeIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MelodyMindOfflineDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('audioFiles')) {
        db.createObjectStore('audioFiles', { keyPath: 'url' });
      }
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
};

// Store audio blob in IndexedDB
const storeAudioInIndexedDB = async (url, blob) => {
  const db = await initializeIndexedDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['audioFiles'], 'readwrite');
    const store = transaction.objectStore('audioFiles');
    
    const request = store.put({ url, blob, timestamp: Date.now() });
    
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
};

// Get audio blob from IndexedDB
const getAudioFromIndexedDB = async (url) => {
  const db = await initializeIndexedDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['audioFiles'], 'readonly');
    const store = transaction.objectStore('audioFiles');
    
    const request = store.get(url);
    
    request.onsuccess = (event) => {
      if (event.target.result) {
        resolve(event.target.result.blob);
      } else {
        resolve(null);
      }
    };
    
    request.onerror = (event) => reject(event.target.error);
  });
};

// Delete audio blob from IndexedDB
const deleteAudioFromIndexedDB = async (url) => {
  const db = await initializeIndexedDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['audioFiles'], 'readwrite');
    const store = transaction.objectStore('audioFiles');
    
    const request = store.delete(url);
    
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
};

/**
 * Save song for offline playback
 * @param {string} url - URL of the audio file to cache
 * @param {object} metadata - Song metadata (name, artist, image, etc.)
 * @returns {Promise<boolean>} - Promise that resolves with true if saved successfully
 */
export const saveSongForOffline = async (url, metadata) => {
  try {
    // Ensure HTTPS URL when app is served over HTTPS
    const secureUrl = ensureHttpsUrl(url);
    
    // Fetch the audio file using the secure URL
    const response = await fetch(secureUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch audio file');
    }
    
    // Get the audio data as blob
    const audioBlob = await response.blob();
    
    // Store the audio blob in IndexedDB with the secure URL
    await storeAudioInIndexedDB(secureUrl, audioBlob);
    
    // Also try to cache via service worker for redundancy
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const channel = new MessageChannel();
        
        // Listen for response
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Service worker timeout'));
          }, 10000);
          
          channel.port1.onmessage = (event) => {
            clearTimeout(timeout);
            if (event.data.status === 'cached') {
              resolve();
            } else {
              reject(new Error(event.data.error || 'Failed to cache via service worker'));
            }
          };
            // Send message to service worker
          navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_AUDIO',
            url: secureUrl,
            audioBlob
          }, [channel.port2]);
        });
        
        console.log('Audio also cached via service worker');
      } catch (swError) {
        console.warn('Service worker caching failed, but IndexedDB succeeded:', swError);
      }
    }
    
    // Store metadata in localStorage for offline access
    const offlineSongs = JSON.parse(localStorage.getItem('offlineSongs') || '[]');
    
    // Check if song already exists (using both original and secure URL)
    const songExists = offlineSongs.some(song => song.url === url || song.url === secureUrl);
    
    if (!songExists) {
      offlineSongs.push({
        url: secureUrl, // Store the secure URL
        originalUrl: url, // Keep reference to original URL for compatibility
        metadata,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('offlineSongs', JSON.stringify(offlineSongs));
    }
    
    return true;
  } catch (error) {
    console.error('Error saving song for offline:', error);
    return false;
  }
};

/**
 * Remove song from offline storage
 * @param {string} url - URL of the audio file to remove
 * @returns {Promise<boolean>} - Promise that resolves with true if removed successfully
 */
export const removeSongFromOffline = async (url) => {
  try {
    const secureUrl = ensureHttpsUrl(url);
    
    // Try to delete from IndexedDB with both URLs
    try {
      await deleteAudioFromIndexedDB(secureUrl);
    } catch (error) {
      // If secure URL fails, try original URL for backward compatibility
      if (secureUrl !== url) {
        await deleteAudioFromIndexedDB(url);
      } else {
        throw error;
      }
    }
    
    // Also try to remove from service worker cache
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const channel = new MessageChannel();
        
        // Listen for response
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Service worker timeout'));
          }, 10000);
          
          channel.port1.onmessage = (event) => {
            clearTimeout(timeout);
            if (event.data.status === 'deleted' || event.data.status === 'delete_failed_not_found') {
              resolve();
            } else {
              reject(new Error(event.data.error || 'Failed to delete via service worker'));
            }
          };
            // Send message to service worker
          navigator.serviceWorker.controller.postMessage({
            type: 'DELETE_AUDIO',
            url: secureUrl
          }, [channel.port2]);
        });
        
        console.log('Audio also removed from service worker cache');
      } catch (swError) {
        console.warn('Service worker deletion failed, but IndexedDB succeeded:', swError);
      }
    }
    
    // Remove metadata from localStorage
    const offlineSongs = JSON.parse(localStorage.getItem('offlineSongs') || '[]')
      .filter(song => song.url !== url && song.url !== secureUrl && song.originalUrl !== url);
    localStorage.setItem('offlineSongs', JSON.stringify(offlineSongs));
    
    return true;
  } catch (error) {
    console.error('Error removing song from offline:', error);
    return false;
  }
};

/**
 * Check if a song is saved for offline playback
 * @param {string} url - URL of the audio file to check
 * @returns {boolean} - True if the song is available offline
 */
export const isSongAvailableOffline = (url) => {
  try {
    const offlineSongs = JSON.parse(localStorage.getItem('offlineSongs') || '[]');
    const secureUrl = ensureHttpsUrl(url);
    
    // Check for both original URL and secure URL for compatibility
    return offlineSongs.some(song => 
      song.url === url || 
      song.url === secureUrl || 
      song.originalUrl === url
    );
  } catch (error) {
    console.error('Error checking offline song status:', error);
    return false;
  }
};

/**
 * Get all songs saved for offline playback
 * @returns {Array} - Array of saved songs with their metadata
 */
export const getOfflineSongs = () => {
  try {
    return JSON.parse(localStorage.getItem('offlineSongs') || '[]');
  } catch (error) {
    console.error('Error getting offline songs:', error);
    return [];
  }
};

/**
 * Get playable URL for an offline song
 * @param {string} url - Original URL of the song
 * @returns {Promise<string>} - Promise that resolves with a playable URL
 */
export const getOfflineSongUrl = async (url) => {
  try {
    console.log('Getting offline song URL for:', url);
    
    // Try with the secure URL first (if app is served over HTTPS)
    const secureUrl = ensureHttpsUrl(url);
    let blob = await getAudioFromIndexedDB(secureUrl);
    
    // If not found with secure URL, try original URL for backward compatibility
    if (!blob && secureUrl !== url) {
      console.log('Trying original URL for backward compatibility');
      blob = await getAudioFromIndexedDB(url);
    }
    
    if (blob) {
      console.log('Found blob in IndexedDB:', {
        size: blob.size,
        type: blob.type
      });
      
      // Validate that the blob is actually audio data
      if (!blob.type.startsWith('audio/') && blob.size < 1000) {
        console.error('Invalid audio blob:', { size: blob.size, type: blob.type });
        return null;
      }
      
      // Additional validation: check if blob contains valid data
      if (blob.size === 0) {
        console.error('Empty blob detected');
        return null;
      }
      
      // Create and validate blob URL
      const blobUrl = URL.createObjectURL(blob);
      console.log('Created blob URL:', blobUrl);
      
      // Test the blob URL immediately
      try {
        const testResponse = await fetch(blobUrl, { method: 'HEAD' });
        if (!testResponse.ok) {
          console.error('Blob URL fetch test failed:', testResponse.status);
          URL.revokeObjectURL(blobUrl);
          return null;
        }
        console.log('Blob URL validation successful');
      } catch (testError) {
        console.error('Blob URL test error:', testError);
        URL.revokeObjectURL(blobUrl);
        return null;
      }
      
      return blobUrl;
    } else {
      console.log('No blob found in IndexedDB for:', url);
    }
    return null;
  } catch (error) {
    console.error('Error getting offline song URL:', error);
    return null;
  }
};

/**
 * Get debug information about offline audio storage
 * @returns {Promise<object>} - Promise that resolves with debug info
 */
export const getOfflineDebugInfo = async () => {
  try {
    const db = await initializeIndexedDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['audioFiles'], 'readonly');
      const store = transaction.objectStore('audioFiles');
      const request = store.getAll();
      
      request.onsuccess = (event) => {
        const cachedSongs = event.target.result;
        const debugInfo = {
          totalSongs: cachedSongs.length,
          totalSize: cachedSongs.reduce((sum, song) => sum + song.blob.size, 0),
          songs: cachedSongs.map(song => ({
            url: song.url.substring(0, 100) + '...',
            size: song.blob.size,
            type: song.blob.type,
            timestamp: new Date(song.timestamp).toISOString()
          }))
        };
        resolve(debugInfo);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error getting debug info:', error);
    return {
      error: error.message,
      totalSongs: 0,
      totalSize: 0,
      songs: []
    };
  }
};

/**
 * Test offline audio functionality
 * @param {string} url - URL to test
 * @returns {Promise<object>} - Test results
 */
export const testOfflineAudio = async (url) => {
  const results = {
    hasBlob: false,
    blobSize: 0,
    blobType: '',
    blobUrlCreated: false,
    blobUrlValid: false,
    audioCanLoad: false,
    error: null
  };
  
  try {
    // Check if blob exists
    const blob = await getAudioFromIndexedDB(url);
    if (!blob) {
      results.error = 'No blob found in IndexedDB';
      return results;
    }
    
    results.hasBlob = true;
    results.blobSize = blob.size;
    results.blobType = blob.type;
    
    // Try to create blob URL
    const blobUrl = URL.createObjectURL(blob);
    results.blobUrlCreated = true;
    
    // Test blob URL with fetch
    try {
      const response = await fetch(blobUrl, { method: 'HEAD' });
      results.blobUrlValid = response.ok;
    } catch (fetchError) {
      results.error = `Blob URL fetch failed: ${fetchError.message}`;
    }
    
    // Test audio loading
    if (results.blobUrlValid) {
      try {
        const testAudio = new Audio();
        testAudio.src = blobUrl;
        testAudio.preload = 'metadata';
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Audio load timeout'));
          }, 5000);
          
          testAudio.addEventListener('loadedmetadata', () => {
            clearTimeout(timeout);
            results.audioCanLoad = true;
            testAudio.remove();
            resolve();
          });
          
          testAudio.addEventListener('error', (e) => {
            clearTimeout(timeout);
            testAudio.remove();
            reject(new Error(`Audio load error: ${e.message || 'Unknown'}`));
          });
        });
      } catch (audioError) {
        results.error = audioError.message;
      }
    }
    
    // Clean up
    URL.revokeObjectURL(blobUrl);
    
  } catch (error) {
    results.error = error.message;
  }
  
  return results;
};