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
  const location = useLocation();

  useEffect(() => {
    let timeoutId;

    const handleOnline = () => {
      console.log('Network: Back online');
      
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Double-check with actual network request
      fetch('/manifest.json', { method: 'HEAD', cache: 'no-cache' })
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
      
      // Delay navigation to offline page to avoid false positives
      timeoutId = setTimeout(() => {
        // Double-check we're actually offline
        fetch('/manifest.json', { method: 'HEAD', cache: 'no-cache' })
          .then(() => {
            console.log('Network: False offline event, still online');
            setIsOffline(false);
          })
          .catch(() => {
            console.log('Network: Confirmed offline, navigating to offline page');
            if (location.pathname !== '/offline') {
              navigate('/offline', { replace: true });
            }
          });
      }, 1000); // 1 second delay
    };

    // Initial check with actual network request
    const checkInitialStatus = async () => {
      try {
        await fetch('/manifest.json', { method: 'HEAD', cache: 'no-cache' });
        setIsOffline(false);
      } catch {
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
    const connectivityInterval = setInterval(() => {
      if (!isOffline) {
        fetch('/manifest.json', { method: 'HEAD', cache: 'no-cache' })
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
