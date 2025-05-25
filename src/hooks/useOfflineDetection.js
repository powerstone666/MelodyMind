import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Enhanced offline detection hook
 * Provides robust offline/online status detection and automatic navigation
 */
export const useOfflineDetection = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();  useEffect(() => {
    let timeoutId;
    let connectivityInterval;

    // Create a fetch with timeout to prevent hanging
    const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout')), timeout)
        )
      ]);
    };

    const handleOnline = () => {
      console.log('Network: Back online');
      
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Double-check with actual network request with timeout
      fetchWithTimeout('/manifest.json', { method: 'HEAD', cache: 'no-cache' }, 3000)
        .then(() => {
          console.log('Network: Confirmed online via fetch');
          setIsOffline(false);
          
          // If we were offline and are now on offline page, navigate back
          if (wasOffline && location.pathname === '/offline') {
            const returnPath = sessionStorage.getItem('preOfflinePath') || '/';
            sessionStorage.removeItem('preOfflinePath');
            navigate(returnPath, { replace: true });
          }
          
          setWasOffline(false);
        })
        .catch(() => {
          console.log('Network: False online event, still offline');
          setIsOffline(true);
        });
    };

    const handleOffline = () => {
      console.log('Network: Going offline');
      setIsOffline(true);
      setWasOffline(true);
      
      // Store current path before navigating to offline page
      if (location.pathname !== '/offline') {
        sessionStorage.setItem('preOfflinePath', location.pathname);
      }
      
      // Navigate to offline page immediately for better UX
      if (location.pathname !== '/offline') {
        navigate('/offline', { replace: true });
      }
    };

    // Initial check with actual network request and fast timeout
    const checkInitialStatus = async () => {
      // Set offline immediately if navigator says so
      if (!navigator.onLine) {
        console.log('Network: Navigator says offline, setting offline state');
        setIsOffline(true);
        if (location.pathname !== '/offline') {
          sessionStorage.setItem('preOfflinePath', location.pathname);
          navigate('/offline', { replace: true });
        }
        return;
      }

      try {
        // Quick network test with 2 second timeout
        await fetchWithTimeout('/manifest.json', { method: 'HEAD', cache: 'no-cache' }, 2000);
        console.log('Network: Initial check - online');
        setIsOffline(false);
      } catch (error) {
        console.log('Network: Initial check - offline', error.message);
        setIsOffline(true);
        if (location.pathname !== '/offline') {
          sessionStorage.setItem('preOfflinePath', location.pathname);
          navigate('/offline', { replace: true });
        }
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    checkInitialStatus();

    // Periodic connectivity check (every 30 seconds when online)
    connectivityInterval = setInterval(() => {
      if (!isOffline) {
        fetchWithTimeout('/manifest.json', { method: 'HEAD', cache: 'no-cache' }, 3000)
          .catch(() => {
            console.log('Network: Periodic check failed, going offline');
            handleOffline();
          });
      }
    }, 30000);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (timeoutId) clearTimeout(timeoutId);
      if (connectivityInterval) clearInterval(connectivityInterval);
    };
  }, [navigate, location.pathname, wasOffline]);

  return {
    isOffline,
    wasOffline
  };
};
