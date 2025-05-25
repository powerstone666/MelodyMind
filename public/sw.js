// MelodyMind Service Worker
const CACHE_NAME = 'melodymind-v1';
const OFFLINE_URL = '/offline';

// Utility function to ensure HTTPS URLs when app is served over HTTPS
const ensureHttpsUrl = (url) => {
  // If the service worker origin is HTTPS and the URL is HTTP, convert it to HTTPS
  if (self.location.protocol === 'https:' && url.startsWith('http:')) {
    return url.replace('http:', 'https:');
  }
  return url;
};

// Assets to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/music icon2.png',
  // Critical assets for immediate loading
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/App.css',
  '/index.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('Service Worker: Error during install:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - handle offline scenarios
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and non-GET requests
  if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    return;
  }

  // Handle navigation requests (when user navigates to a page)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If online and response is ok, return it
          if (response && response.status === 200) {
            return response;
          }
          // If response is not ok, show offline page
          return caches.match(OFFLINE_URL);
        })
        .catch(() => {
          // If fetch fails (offline), show offline page
          console.log('Service Worker: Network failed, serving offline page');
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }
  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // For audio files, also try to match with HTTPS URL
        if (event.request.url.includes('saavncdn.com') || event.request.url.includes('.mp3') || event.request.url.includes('.mp4')) {
          const secureUrl = ensureHttpsUrl(event.request.url);
          if (secureUrl !== event.request.url) {
            return caches.match(secureUrl).then((secureResponse) => {
              if (secureResponse) {
                console.log('Service Worker: Found cached audio with HTTPS URL');
                return secureResponse;
              }
              // Continue with normal fetch logic
              return fetchFromNetwork(event.request);
            });
          }
        }

        return fetchFromNetwork(event.request);
      })
  );

  function fetchFromNetwork(request) {
    // Try to fetch from network
    return fetch(request)
      .then((response) => {
        // Don't cache if response is not ok
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone response for caching
        const responseToCache = response.clone();

        // Cache the response for future use
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // If it's an image request that fails, return a placeholder
        if (request.destination === 'image') {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }        // For other failed requests, return null
        return null;
      });
  }
});

// Handle offline audio storage messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_AUDIO') {
    const { url, audioBlob } = event.data;
    
    // Ensure HTTPS URL for consistent caching
    const secureUrl = ensureHttpsUrl(url);
    
    // Store audio in cache for offline playback
    caches.open(CACHE_NAME)
      .then((cache) => {
        const response = new Response(audioBlob, {
          headers: { 'Content-Type': 'audio/mpeg' }
        });
        return cache.put(secureUrl, response);
      })
      .then(() => {
        // Send success message back
        event.ports[0].postMessage({ 
          type: 'AUDIO_CACHE_STATUS', 
          status: 'cached',
          url: secureUrl 
        });
      })
      .catch((error) => {
        console.error('Error caching audio:', error);
        event.ports[0].postMessage({ 
          type: 'AUDIO_CACHE_STATUS', 
          status: 'cache_failed',
          url: secureUrl,
          error: error.message 
        });
      });
  }
    if (event.data && event.data.type === 'DELETE_AUDIO') {
    const { url } = event.data;
    
    // Ensure HTTPS URL for consistent deletion
    const secureUrl = ensureHttpsUrl(url);
    
    // Remove audio from cache
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.delete(secureUrl);
      })
      .then((deleted) => {
        // Send success message back
        event.ports[0].postMessage({ 
          type: 'AUDIO_DELETE_STATUS', 
          status: deleted ? 'deleted' : 'delete_failed_not_found',
          url: secureUrl 
        });
      })
      .catch((error) => {
        console.error('Error deleting audio from cache:', error);
        event.ports[0].postMessage({ 
          type: 'AUDIO_DELETE_STATUS', 
          status: 'delete_failed',
          url: secureUrl,
          error: error.message 
        });
      });
  }
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement any background sync logic here
  // For example, sync user data when back online
  try {
    // Check if online
    const response = await fetch('/api/ping', { method: 'HEAD' });
    if (response.ok) {
      console.log('Service Worker: Back online, performing sync');
      // Perform sync operations
    }
  } catch (error) {
    console.log('Service Worker: Still offline');
  }
}
