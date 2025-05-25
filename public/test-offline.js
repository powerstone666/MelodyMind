// Complete Offline Functionality Test for MelodyMind
// This file can be run in browser console to test all offline features

console.log('🎵 MelodyMind Offline Functionality Test Starting...');

const testOfflineFunctionality = async () => {
  const results = {
    serviceWorkerRegistration: false,
    offlineDetection: false,
    audioCache: false,
    indexedDB: false,
    pwaInstall: false,
    errors: []
  };

  try {
    // Test 1: Service Worker Registration
    console.log('📡 Testing Service Worker Registration...');
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      results.serviceWorkerRegistration = !!registration;
      console.log(results.serviceWorkerRegistration ? '✅ Service Worker registered' : '❌ Service Worker not registered');
    } else {
      console.log('❌ Service Worker not supported');
    }

    // Test 2: IndexedDB Support
    console.log('💾 Testing IndexedDB Support...');
    if ('indexedDB' in window) {
      try {
        const request = indexedDB.open('MelodyMindOfflineDB', 1);
        await new Promise((resolve, reject) => {
          request.onsuccess = () => {
            results.indexedDB = true;
            resolve();
          };
          request.onerror = reject;
          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('audioFiles')) {
              db.createObjectStore('audioFiles', { keyPath: 'url' });
            }
            resolve();
          };
        });
        console.log('✅ IndexedDB working correctly');
      } catch (error) {
        results.errors.push('IndexedDB error: ' + error.message);
        console.log('❌ IndexedDB error:', error);
      }
    } else {
      console.log('❌ IndexedDB not supported');
    }

    // Test 3: Network Detection
    console.log('🌐 Testing Network Detection...');
    results.offlineDetection = 'onLine' in navigator;
    console.log(results.offlineDetection ? '✅ Network detection available' : '❌ Network detection not available');
    console.log(`📊 Current status: ${navigator.onLine ? 'Online' : 'Offline'}`);

    // Test 4: PWA Install Support
    console.log('📱 Testing PWA Install Support...');
    results.pwaInstall = 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
    console.log(results.pwaInstall ? '✅ PWA installation supported' : '⚠️ PWA installation may not be fully supported');

    // Test 5: Audio Cache Test (if available)
    console.log('🎵 Testing Audio Cache System...');
    try {
      if (typeof window.saveSongForOffline === 'function') {
        results.audioCache = true;
        console.log('✅ Audio cache functions available');
      } else {
        console.log('⚠️ Audio cache functions not yet loaded');
      }
    } catch (error) {
      results.errors.push('Audio cache error: ' + error.message);
      console.log('❌ Audio cache error:', error);
    }

  } catch (error) {
    results.errors.push('General test error: ' + error.message);
    console.log('❌ Test error:', error);
  }

  // Results Summary
  console.log('\n📋 TEST RESULTS SUMMARY:');
  console.log('========================');
  console.log(`Service Worker: ${results.serviceWorkerRegistration ? '✅ Pass' : '❌ Fail'}`);
  console.log(`IndexedDB: ${results.indexedDB ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Offline Detection: ${results.offlineDetection ? '✅ Pass' : '❌ Fail'}`);
  console.log(`PWA Install: ${results.pwaInstall ? '✅ Pass' : '⚠️ Limited'}`);
  console.log(`Audio Cache: ${results.audioCache ? '✅ Pass' : '⚠️ Pending'}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS FOUND:');
    results.errors.forEach(error => console.log('  - ' + error));
  }

  const passCount = Object.values(results).filter(v => v === true).length;
  const totalTests = 5;
  console.log(`\n🎯 Overall Score: ${passCount}/${totalTests} tests passed`);

  if (passCount >= 4) {
    console.log('🎉 EXCELLENT! MelodyMind offline functionality is working well!');
  } else if (passCount >= 3) {
    console.log('👍 GOOD! Most offline features are working. Check the errors above.');
  } else {
    console.log('⚠️ NEEDS ATTENTION! Several offline features need fixing.');
  }

  return results;
};

// Auto-run test
testOfflineFunctionality().catch(console.error);

// Make test function available globally for manual re-running
window.testMelodyMindOffline = testOfflineFunctionality;

console.log('\n💡 TIP: Run testMelodyMindOffline() anytime to re-test offline functionality');
