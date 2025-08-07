import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, OAuthProvider, browserLocalPersistence } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyBGUD88ASUFPUhGBv9bHfXDj0V0dElR1PA",
  authDomain: "e-learning-511b3.firebaseapp.com",
  projectId: "e-learning-511b3",
  storageBucket: "e-learning-511b3.firebasestorage.app",
  messagingSenderId: "897437623693",
  appId: "1:897437623693:web:3ebd514344100fc4ba09c4",
  measurementId: "G-2DVEWXE8YD"
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