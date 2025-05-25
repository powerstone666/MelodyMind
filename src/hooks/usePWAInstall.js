import { useState, useEffect } from 'react';

/**
 * Hook for PWA installation functionality
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return;
      }
      
      if (document.referrer.includes('android-app://')) {
        setIsInstalled(true);
        return;
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    // Check initial state
    checkIfInstalled();

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      console.log('PWA: No install prompt available');
      return false;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`PWA: User response to install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        setCanInstall(false);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('PWA: Error during installation:', error);
      return false;
    }
  };

  return {
    canInstall,
    isInstalled,
    installPWA
  };
};
