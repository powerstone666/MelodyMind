import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword as firebaseUpdatePassword
} from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

// Token refresh time in milliseconds (default: 1 hour)
const TOKEN_REFRESH_TIME = 60 * 60 * 1000;

// Function to handle email/password login
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get a fresh token
    const token = await user.getIdToken(true);
    
    // Store the token and expiry time
    const expirationTime = Date.now() + TOKEN_REFRESH_TIME;
    
    // Store user data and token information
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      token,
      tokenExpiration: expirationTime
    };
    
    // Save user data to localStorage
    localStorage.setItem("Users", JSON.stringify(userData));
    localStorage.setItem('loginTimestamp', Date.now().toString()); // Add login timestamp
    
    // Record login timestamp in Firestore
    await updateUserLastLogin(user.uid);
    
    return userData;
  } catch (error) {
    throw error;
  }
};

// Function to handle signup with email/password
export const signupWithEmailAndPassword = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: name
    });
    
    // Get token
    const token = await user.getIdToken();
    
    // Store expiration time
    const expirationTime = Date.now() + TOKEN_REFRESH_TIME;
    
    // Create user data object
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: user.photoURL,
      token,
      tokenExpiration: expirationTime
    };
    
    // Store in localStorage
    localStorage.setItem("Users", JSON.stringify(userData));
    localStorage.setItem('loginTimestamp', Date.now().toString()); // Add login timestamp
    
    // Create user record in Firestore
    await createUserRecord(user.uid, email, name);
    
    return userData;
  } catch (error) {
    throw error;
  }
};

// Function to handle Google sign-in
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Get the token
    const token = await user.getIdToken();
    const expirationTime = Date.now() + TOKEN_REFRESH_TIME;
    
    // Create user data
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      token,
      tokenExpiration: expirationTime
    };
    
    // Store in localStorage
    localStorage.setItem("Users", JSON.stringify(userData));
    localStorage.setItem('loginTimestamp', Date.now().toString()); // Add login timestamp
    
    // Check if the user already exists, if not, create a record
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await createUserRecord(user.uid, user.email, user.displayName, user.photoURL);
    } else {
      await updateUserLastLogin(user.uid);
    }
    
    return userData;
  } catch (error) {
    throw error;
  }
};

// Function to send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

// Function to handle user logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("Users");
    localStorage.removeItem('loginTimestamp'); // Remove login timestamp
    return true;
  } catch (error) {
    throw error;
  }
};

// Function to check if token is valid and refresh if needed
export const validateAndRefreshToken = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("Users"));
    
    if (!userData) {
      return null;
    }
    
    // Check if token is expired
    if (userData.tokenExpiration && Date.now() >= userData.tokenExpiration) {
      // Token expired, refresh it
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        // User not logged in
        localStorage.removeItem("Users");
        return null;
      }
      
      // Get new token
      const newToken = await currentUser.getIdToken(true);
      const newExpirationTime = Date.now() + TOKEN_REFRESH_TIME;
      
      // Update user data with new token
      userData.token = newToken;
      userData.tokenExpiration = newExpirationTime;
      
      // Update localStorage
      localStorage.setItem("Users", JSON.stringify(userData));
    }
    
    return userData;
  } catch (error) {
    console.error("Error validating token:", error);
    // On any error, clear the localStorage data
    localStorage.removeItem("Users");
    return null;
  }
};

// Helper function to create user record in Firestore
const createUserRecord = async (uid, email, displayName, photoURL = null) => {
  try {
    await setDoc(doc(db, "users", uid), {
      email,
      displayName,
      photoURL,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  } catch (error) {
    console.error("Error creating user record:", error);
  }
};

// Helper function to update user's last login
const updateUserLastLogin = async (uid) => {
  try {
    await setDoc(doc(db, "users", uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating last login:", error);
  }
};

// Function to update user profile
export const updateUserProfile = async (displayName, photoURL = null) => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }
    
    // Update profile in Firebase Auth
    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (photoURL) updateData.photoURL = photoURL;
    
    await updateProfile(currentUser, updateData);
    
    // Update profile in Firestore
    await setDoc(doc(db, "users", currentUser.uid), {
      ...updateData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Get a fresh token
    const token = await currentUser.getIdToken(true);
    const expirationTime = Date.now() + TOKEN_REFRESH_TIME;
    
    // Create updated user data
    const userData = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      token,
      tokenExpiration: expirationTime
    };
    
    // Store in localStorage
    localStorage.setItem("Users", JSON.stringify(userData));
      return userData;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Function to update user password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("No authenticated user found");
    }
    
    if (!user.email) {
      throw new Error("User has no email to re-authenticate with");
    }
    
    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await firebaseUpdatePassword(user, newPassword);
    
    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};
