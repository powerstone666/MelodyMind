// User profile related database operations
import { db, storage } from "./firebaseConfig";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

/**
 * Fetch user profile data including stats and activities
 * @param {string} userId - Firebase user ID
 * @returns {Promise<Object>} User profile data
 */
export const fetchUserProfileData = async (userId) => {
  try {
    // Get user base data
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return null;
    }
      // Initialize profile data with user document
    const profileData = userDoc.data();
    
    // Get liked songs count
    const likedSongsQuery = query(
      collection(db, "likedSongs"),
      where("userId", "==", userId)
    );
    const likedSongsSnapshot = await getDocs(likedSongsQuery);
    profileData.likedSongsCount = likedSongsSnapshot.size;
    
    // Get recent activity - last 5 played songs
    const recentActivityQuery = query(
      collection(db, "user_activity"),
      where("userId", "==", userId),
      where("activityType", "==", "played"),
      orderBy("timestamp", "desc"),
      limit(5)
    );    const recentActivitySnapshot = await getDocs(recentActivityQuery);
    profileData.recentActivity = recentActivitySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return profileData;
  } catch (error) {
    console.error("Error fetching user profile data:", error);
    throw error;
  }
};

/**
 * Record song activity for user (play, like, add to playlist)
 * @param {string} userId - Firebase user ID
 * @param {string} songId - Song ID
 * @param {string} songName - Song name
 * @param {string} artistName - Artist name
 * @param {string} activityType - Type of activity (played, liked, added_to_playlist)
 * @param {string} imageUrl - Song cover image URL
 * @returns {Promise<void>}
 */
export const recordUserActivity = async (
  userId, 
  songId, 
  songName, 
  artistName, 
  activityType = "played",
  imageUrl = null
) => {
  try {
    // Guard check to ensure we have all required data
    if (!userId || !songId || !songName) {
      console.warn("Missing required data for activity tracking:", {userId, songId, songName});
      return;
    }
    
    const activityRef = collection(db, "user_activity");
    
    // Get current date in YYYY-MM-DD format for grouping
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    // Add client-side timestamp as a fallback
    const clientTimestamp = new Date();
    
    await addDoc(activityRef, {
      userId,
      songId,
      songName,
      artistName: artistName || "Unknown Artist",
      imageUrl,
      activityType,
      timestamp: serverTimestamp(),
      clientTimestamp, // Fallback timestamp in case serverTimestamp fails
      date: dateStr // Store date string for easier querying by day
    });
  } catch (error) {
    console.error("Error recording user activity:", error);
    // Don't throw, just log - this is a non-critical operation
  }
};

/**
 * Get user's listening statistics
 * @param {string} userId - Firebase user ID
 * @returns {Promise<Object>} Listening statistics
 */
export const getUserListeningStats = async (userId) => {
  try {
    // Most played artists
    const artistStatsQuery = query(
      collection(db, "user_activity"),
      where("userId", "==", userId),
      where("activityType", "==", "played")
    );
    
    const activitySnapshot = await getDocs(artistStatsQuery);
    
    // Process data to get statistics
    const artistCounts = {};
    activitySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.artistName) {
        artistCounts[data.artistName] = (artistCounts[data.artistName] || 0) + 1;
      }
    });
    
    // Convert to array and sort
    const topArtists = Object.entries(artistCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      topArtists,
      totalPlays: activitySnapshot.size
    };
  } catch (error) {
    console.error("Error getting user listening stats:", error);
    return {
      topArtists: [],
      totalPlays: 0
    };
  }
};

/**
 * Get user's daily play statistics for the last 7 days
 * @param {string} userId - Firebase user ID
 * @returns {Promise<Array>} Daily play counts
 */
export const getUserDailyPlayStats = async (userId) => {
  try {
    // Calculate date for 7 days ago
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // Get data for last 7 days (including today)
    
    // Format as YYYY-MM-DD
    const startDateStr = sevenDaysAgo.toISOString().split('T')[0];
    
    // Get activities for the last 7 days
    const activitiesQuery = query(
      collection(db, "user_activity"),
      where("userId", "==", userId),
      where("activityType", "==", "played"),
      where("date", ">=", startDateStr),
      orderBy("date", "asc")
    );
    
    const activitySnapshot = await getDocs(activitiesQuery);
    
    // Group by date
    const dateMap = {};
    
    // Initialize all dates in the range
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
    }
    
    // Count activities by date
    activitySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.date) {
        dateMap[data.date] = (dateMap[data.date] || 0) + 1;
      }
    });
      // Convert to array format for chart
    const dailyStats = Object.entries(dateMap).map(([date, count]) => {
      // Format date for display (e.g., "May 12")
      const displayDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      return {
        date: displayDate,
        count,
        rawDate: date // Keep raw date for sorting
      };
    });
    
    // Sort by date (should already be sorted from the query, but just to be safe)
    dailyStats.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    
    return dailyStats;
  } catch (error) {
    console.error("Error getting daily play stats:", error);
    return [];
  }
};

/**
 * Upload user profile photo to Firebase Storage
 * @param {string} userId - Firebase user ID
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Download URL of the uploaded image
 */
export const uploadProfilePhoto = async (userId, file) => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `profile_photos/${userId}/${file.name}`);
    
    // Upload file with progress monitoring
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Return a promise that resolves with the download URL when upload completes
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can track progress here if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          // Handle upload errors
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Update user's profile photo URL in Firestore
          const userDocRef = doc(db, "users", userId);
          await updateDoc(userDocRef, {
            photoURL: downloadURL,
            updatedAt: serverTimestamp()
          });
          
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    throw error;
  }
};

/**
 * Delete user's previous profile photo from storage
 * @param {string} photoURL - Full URL of the photo to delete
 * @returns {Promise<void>}
 */
export const deleteProfilePhoto = async (photoURL) => {
  try {
    // Extract the storage path from the URL
    // Only delete if it's from our storage (not from Google Auth)
    if (photoURL && photoURL.includes('firebase') && photoURL.includes('profile_photos')) {
      const storageRef = ref(storage, photoURL);
      await deleteObject(storageRef);
    }
  } catch (error) {
    console.error("Error deleting profile photo:", error);
    // Don't throw error, just log it - this is not critical
  }
};

/**
 * Get user's recent activity with detailed information
 * @param {string} userId - Firebase user ID
 * @param {number} limit - Maximum number of activities to return
 * @returns {Promise<Array>} Recent activities
 */
export const getUserRecentActivity = async (userId, activityLimit = 10) => {
  try {
    const recentActivityQuery = query(
      collection(db, "user_activity"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(activityLimit)
    );
    
    const activitySnapshot = await getDocs(recentActivityQuery);
    const activities = [];
    
    for (const doc of activitySnapshot.docs) {
      const activity = doc.data();
      
      // Format the activity for display
      const formattedActivity = {
        id: doc.id,
        type: activity.activityType,
        songName: activity.songName,
        artistName: activity.artistName,
        imageUrl: activity.imageUrl,
        timestamp: activity.timestamp,
        songId: activity.songId
      };
      
      activities.push(formattedActivity);
    }
    
    return activities;
  } catch (error) {
    console.error("Error getting user recent activity:", error);
    return [];
  }
};
