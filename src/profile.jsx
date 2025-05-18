import React, { useContext, useState, useEffect, useRef } from 'react';
import { Context } from './context';
import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase/firebaseConfig";
import { updateUserProfile } from './Firebase/auth';
import { fetchUserProfileData, uploadProfilePhoto, deleteProfilePhoto } from './Firebase/userProfile';
import { fetchUser } from './Firebase/database';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiLogOut, FiEdit, FiCheck, FiUpload, FiTrash2, FiX } from 'react-icons/fi';
import useMediaQuery from './useMedia';

function Profile() {
  const { Users, setUsers } = useContext(Context);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const isAboveMedium = useMediaQuery("(min-width: 768px)");

  // Fetch user data from Firestore  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!Users || !Users.uid) {
        setLoading(false);
        navigate('/login', { state: { returnUrl: '/profile' } });
        return;
      }

      try {
        // Fetch extended profile data
        const profileData = await fetchUserProfileData(Users.uid);
         
        if (profileData) {
         
          setUserData(profileData);
          setDisplayName(profileData.displayName || '');
        } else {
          // If no Firestore data, use localStorage data
          setUserData(Users);
          setDisplayName(Users.displayName || '');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [Users]);
        const likes = await fetchUser();
        setLikedSongs(likes || []);

        // Get user listening statistics
        const stats = await getUserListeningStats(Users.uid);
        setUserStats(stats);
        
        // Get daily play statistics
        const dailyPlayStats = await getUserDailyPlayStats(Users.uid);
        setDailyStats(dailyPlayStats);
        setStatsLoading(false);

        // Get recent activity
        const activities = await getUserRecentActivity(Users.uid, 5);
        setRecentActivity(activities.filter(activity => activity.type === 'played'));
        setActivityLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
        // Fallback to localStorage data
        setUserData(Users);
        setDisplayName(Users.displayName || '');
        setActivityLoading(false);
        setStatsLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [Users]);

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Firebase Timestamp
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('en-US', {
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Regular timestamp number
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date formatting error:", error);      return 'Invalid date';
    }
  };
  
  // Handle profile photo upload
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Please select an image under 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      // If user already has a custom profile photo, delete it first
      if (userData?.photoURL && userData.photoURL.includes('profile_photos')) {
        await deleteProfilePhoto(userData.photoURL);
      }
      
      // Upload the new photo
      const photoURL = await uploadProfilePhoto(Users.uid, file);
      
      // Update user profile with new photo URL
      const updatedUserData = await updateUserProfile(userData.displayName, photoURL);
      
      // Update state
      setUserData(prev => ({
        ...prev,
        photoURL
      }));
      setUsers(updatedUserData);
      
      toast.success('Profile photo updated successfully');
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast.error('Failed to upload profile photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle display name update
  const handleUpdateProfile = async () => {
    // Validation
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    try {
      const updatedUserData = await updateUserProfile(displayName);
      setUserData(prev => ({
        ...prev,
        displayName
      }));
      setUsers(updatedUserData);
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-melody-pink-500/30 h-16 w-16 flex items-center justify-center mb-3">
            <svg className="animate-spin h-8 w-8 text-melody-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <span className="text-melody-pink-500 text-lg font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!Users) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full p-4 text-white">
        <svg className="w-24 h-24 text-melody-pink-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
        <p className="text-gray-300 text-center mb-6">Please log in to view your profile</p>
        <a 
          href="/login" 
          className="px-6 py-3 bg-melody-pink-600 text-white rounded-full font-medium hover:bg-melody-pink-700 transition-colors duration-300"
        >
          Go to Login
        </a>
      </div>
    );
  }  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full p-4 md:p-8 pb-28 md:pb-36 overflow-y-auto">
      <div className="w-full h-full">
        <div className="bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 shadow-lg rounded-lg overflow-hidden mb-28">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-melody-pink-800 to-purple-900">
            <div className="absolute -bottom-16 left-6 md:left-10">
              <div className="relative group">
                <img 
                  src={userData?.photoURL || 'https://via.placeholder.com/150?text=User'} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-deep-blue shadow-lg object-cover"
                />
                
                {/* Photo upload overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={triggerFileInput}
                >
                  {uploadingPhoto ? (
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </div>
                
                {/* Hidden file input */}
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                
                {userData?.photoURL && (
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-6 h-6 border-2 border-deep-blue flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-20 px-6 py-6 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              {editMode ? (
                <div className="w-full md:w-auto">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-deep-grey/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500 focus:border-transparent"
                    placeholder="Display Name"
                  />
                </div>
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {userData?.displayName || 'Music Lover'}
                </h1>
              )}
              
              {editMode ? (
                <div className="flex mt-4 md:mt-0 space-x-3 w-full md:w-auto">
                  <button
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 rounded-lg bg-melody-pink-600 text-white font-medium hover:bg-melody-pink-500 transition-colors duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setDisplayName(userData?.displayName || '');
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-deep-grey/80 hover:bg-deep-grey/60 text-white font-medium transition-colors duration-200 border border-gray-600"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-melody-pink-500 text-lg font-medium mb-2">Account Information</h2>
                  <div className="bg-deep-grey/30 p-4 rounded-lg border border-gray-700">
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white">{userData?.email || 'No email available'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Account Created</p>
                        <p className="text-white">{userData?.createdAt ? formatDate(userData.createdAt) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Last Login</p>
                        <p className="text-white">{userData?.lastLogin ? formatDate(userData.lastLogin) : 'N/A'}</p>
                      </div>
                    </div>
                  </div>                </div>
                
                {/* Recent Activity Section */}
                <RecentActivity recentSongs={recentActivity} loading={activityLoading} />
              </div><div className="space-y-6">
                <div>
                  <h2 className="text-melody-pink-500 text-lg font-medium mb-2">Profile Stats</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-deep-grey/30 p-4 rounded-lg border border-gray-700 flex flex-col items-center">
                      <span className="text-2xl font-bold text-white">
                        {likedSongs.length || 0}
                      </span>
                      <span className="text-gray-400 text-sm">Liked Songs</span>
                    </div>
                  </div>
                </div>                <div>                  <h2 className="text-melody-pink-500 text-lg font-medium mb-2">Listening Stats</h2>
                  {statsLoading ? (
                    <div className="bg-deep-grey/30 p-4 rounded-lg border border-gray-700 animate-pulse">
                      <div className="h-4 bg-deep-grey/60 rounded w-1/2 mb-3"></div>
                      <div className="h-32 bg-deep-grey/60 rounded"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-deep-grey/30 p-4 rounded-lg border border-gray-700">
                        <div className="mb-3">
                          <p className="text-gray-400 text-sm mb-1">Total Plays</p>
                          <p className="text-white font-bold">{userStats?.totalPlays || 0} songs</p>
                        </div>
                      </div>
                      
                      {/* Daily Stats Chart */}
                      <DailyPlayStatsChart dailyStats={dailyStats} />
                      
                      {/* Top Artists Chart */}
                      {userStats?.topArtists && userStats.topArtists.length > 0 && (
                        <PlayCountChart artists={userStats.topArtists} />
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-melody-pink-500 text-lg font-medium mb-2">MelodyMind Premium</h2>
                  <div className="bg-gradient-to-r from-melody-pink-600/80 to-purple-600/80 p-4 rounded-lg border border-melody-pink-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold">Free Plan</p>
                        <p className="text-gray-200 text-sm">Upgrade for ad-free music</p>
                      </div>
                      <button className="px-3 py-1 bg-white text-melody-pink-600 rounded font-medium text-sm">
                        Upgrade
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
