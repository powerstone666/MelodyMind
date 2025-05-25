// Offline audio functionality using IndexedDB

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
    // Fetch the audio file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch audio file');
    }
    
    // Get the audio data as blob
    const audioBlob = await response.blob();
    
    // Store the audio blob in IndexedDB
    await storeAudioInIndexedDB(url, audioBlob);
    
    // Store metadata in localStorage for offline access
    const offlineSongs = JSON.parse(localStorage.getItem('offlineSongs') || '[]');
    
    // Check if song already exists
    const songExists = offlineSongs.some(song => song.url === url);
    
    if (!songExists) {
      offlineSongs.push({
        url,
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
    // Delete from IndexedDB
    await deleteAudioFromIndexedDB(url);
    
    // Remove metadata from localStorage
    const offlineSongs = JSON.parse(localStorage.getItem('offlineSongs') || '[]')
      .filter(song => song.url !== url);
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
    return offlineSongs.some(song => song.url === url);
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
    const blob = await getAudioFromIndexedDB(url);
    if (blob) {
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error('Error getting offline song URL:', error);
    return null;
  }
};