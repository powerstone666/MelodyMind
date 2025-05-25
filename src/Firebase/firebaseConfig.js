import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, OAuthProvider, browserLocalPersistence } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Set session persistence to 'local' for extended login duration
auth.setPersistence(browserLocalPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing a tab or window will clear any existing state.
    // ...
    // New sign-in will be persisted with session persistence.
    console.log("Firebase Auth persistence set to LOCAL.");
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error setting Firebase Auth persistence:", errorCode, errorMessage);
  });

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('github.com');
export const db = getFirestore(app);
export const storage = getStorage(app);

export const timestamp = serverTimestamp;