import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

function PWAInstallBanner() {
  const { canInstall, isInstalled, installPWA } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  // Don't show banner if app is installed or can't be installed or user dismissed it
  if (!canInstall || isInstalled || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await installPWA();
      if (success) {
        setIsVisible(false);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember user's choice
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:bottom-6 md:left-6 md:right-auto md:max-w-sm">
      <div className="bg-gradient-to-r from-melody-pink-600 to-melody-purple-600 text-white rounded-lg shadow-lg p-4 border border-melody-pink-500/30">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">
                Install MelodyMind
              </h4>
              <button 
                onClick={handleDismiss}
                className="text-white/80 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-xs text-white/90 mt-1">
              Get the full app experience with offline music and faster access
            </p>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex items-center space-x-2 bg-white text-melody-pink-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-70"
              >
                {isInstalling ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Installing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Install</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-sm text-white/90 hover:text-white transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PWAInstallBanner;
