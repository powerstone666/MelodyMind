import React, { useContext, useState, useEffect, useRef } from 'react';
import { Context } from './context';
import { auth } from "./Firebase/firebaseConfig";
import { updateUserProfile, updatePassword } from './Firebase/auth';
import { fetchUserProfileData, uploadProfilePhoto, deleteProfilePhoto } from './Firebase/userProfile';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiLogOut, FiEdit, FiCheck, FiUpload, FiTrash2, FiX, FiShield } from 'react-icons/fi';

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
  const [userStats, setUserStats] = useState({});
  const [listeningPreferences, setListeningPreferences] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
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
          console.log("Fetched profile data:", profileData);
          setUserData(profileData);
          setDisplayName(profileData.displayName || '');
          
          // Set additional stats if available
          if (profileData.stats) {
            setUserStats(profileData.stats);
          }
          
          // Set listening preferences if available
          if (profileData.preferences) {
            setListeningPreferences(profileData.preferences);
          }
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
  }, [Users, navigate]);

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Firebase Timestamp
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('en-US', {
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        });
      }
      
      // Regular timestamp number
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'Invalid date';
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

  // Handle password change
  const handlePasswordChange = async () => {
    // Validation
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      toast.success("Password updated successfully");
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error updating password:", error);
      
      if (error.code === 'auth/wrong-password') {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to update password. You may need to re-login before changing password.");
      }
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("Users");
      setUsers(null);
      navigate('/');
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] w-full">
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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] w-full p-4 text-white">
        <svg className="w-24 h-24 text-melody-pink-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
        <p className="text-gray-300 text-center mb-6">Please log in to view your profile</p>
        <Link 
          to="/login" 
          className="px-6 py-3 bg-melody-pink-600 text-white rounded-full font-medium hover:bg-melody-pink-700 transition-colors duration-300"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] w-full p-4 md:p-8 pb-28 md:pb-36 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-[#151B28] border border-gray-800 shadow-lg rounded-lg overflow-hidden mb-8">
          {/* Profile Header */}
          <div className="relative h-40 bg-gradient-to-r from-melody-pink-800 to-purple-900">
            <div className="absolute -bottom-14 left-6 md:left-10">
              <div className="relative group">
                <img 
                  src={userData?.photoURL || 'https://via.placeholder.com/150?text=User'} 
                  alt="Profile" 
                  className="w-28 h-28 rounded-full border-4 border-gray-900 shadow-lg object-cover"
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
                    <FiUpload className="h-6 w-6 text-white" />
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
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-18 px-6 py-6 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-6">
              {editMode ? (
                <div className="w-full md:w-auto">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500 focus:border-transparent"
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
                    className="px-4 py-2 rounded-lg bg-melody-pink-600 text-white font-medium hover:bg-melody-pink-500 transition-colors duration-200 flex items-center"
                  >
                    <FiCheck className="mr-2" /> Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setDisplayName(userData?.displayName || '');
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center"
                  >
                    <FiX className="mr-2" /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors duration-200 border border-gray-700 flex items-center"
                >
                  <FiEdit className="mr-2" /> Edit Profile
                </button>
              )}
            </div>            {/* Main Content */}
            <div className="space-y-8">
              {/* Tabs for navigation */}
              <div className="flex overflow-x-auto space-x-2 border-b border-gray-700 pb-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-2 rounded-t-lg ${activeTab === 'profile' 
                    ? 'bg-melody-pink-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} transition-colors`}
                >
                  Profile
                </button>
                <button 
                  onClick={() => setActiveTab('stats')}
                  className={`px-4 py-2 rounded-t-lg ${activeTab === 'stats' 
                    ? 'bg-melody-pink-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} transition-colors`}
                >
                  Listening Stats
                </button>
                <button 
                  onClick={() => setActiveTab('preferences')}
                  className={`px-4 py-2 rounded-t-lg ${activeTab === 'preferences' 
                    ? 'bg-melody-pink-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} transition-colors`}
                >
                  Preferences
                </button>
                <button 
                  onClick={() => setActiveTab('subscription')}
                  className={`px-4 py-2 rounded-t-lg ${activeTab === 'subscription' 
                    ? 'bg-melody-pink-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} transition-colors`}
                >
                  Subscription
                </button>
              </div>

              {activeTab === 'profile' && (
                <>
                  {/* Account Information */}
                  <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center mb-4">
                      <FiUser className="text-melody-pink-500 mr-3" size={20} />
                      <h2 className="text-xl font-bold text-white">Account Information</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-gray-700">
                        <div className="md:w-1/3">
                          <p className="text-gray-400 font-medium">Email</p>
                        </div>
                        <div className="md:w-2/3 flex items-center">
                          <FiMail className="text-gray-500 mr-2" />
                          <p className="text-white">{userData?.email || 'No email available'}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-gray-700">
                        <div className="md:w-1/3">
                          <p className="text-gray-400 font-medium">Account Created</p>
                        </div>
                        <div className="md:w-2/3">
                          <p className="text-white">{userData?.createdAt ? formatDate(userData.createdAt) : 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center py-2">
                        <div className="md:w-1/3">
                          <p className="text-gray-400 font-medium">Last Login</p>
                        </div>
                        <div className="md:w-2/3">
                          <p className="text-white">{userData?.lastLogin ? formatDate(userData.lastLogin) : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Password Section */}
                  <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                    <div className="flex items-center mb-4">
                      <FiLock className="text-melody-pink-500 mr-3" size={20} />
                      <h2 className="text-xl font-bold text-white">Password & Security</h2>
                    </div>
                    
                    {isChangingPassword ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Current Password</label>
                          <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">New Password</label>
                          <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Confirm New Password</label>
                          <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-melody-pink-500"
                          />
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <button 
                            onClick={handlePasswordChange}
                            className="px-4 py-2 bg-melody-pink-600 text-white rounded-lg hover:bg-melody-pink-500 transition-colors flex items-center"
                          >
                            <FiShield className="mr-2" /> Update Password
                          </button>
                          <button 
                            onClick={() => {
                              setIsChangingPassword(false);
                              setCurrentPassword('');
                              setNewPassword('');
                              setConfirmPassword('');
                            }}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                          >
                            <FiX className="mr-2" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400">Change your account password</p>
                        <button 
                          onClick={() => setIsChangingPassword(true)}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                        >
                          <FiLock className="mr-2" /> Change Password
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'stats' && (
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <h2 className="text-xl font-bold text-white">Your Listening Stats</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-1">Total Songs Played</p>
                      <p className="text-2xl font-bold text-white">{userStats.totalPlays || 0}</p>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-1">Total Listening Time</p>
                      <p className="text-2xl font-bold text-white">{userStats.totalHours 
                        ? `${userStats.totalHours} hours` 
                        : '0 hours'}</p>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-1">Favorite Genre</p>
                      <p className="text-2xl font-bold text-white">{userStats.favoriteGenre || 'Not enough data'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Top Artists</h3>
                      <div className="space-y-2">
                        {userStats.topArtists && userStats.topArtists.length > 0 ? (
                          userStats.topArtists.map((artist, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-900/60 p-3 rounded-lg">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-melody-pink-800 flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <span className="text-white">{artist.name}</span>
                              </div>
                              <span className="text-gray-400">{artist.count} plays</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 italic">No artist data available yet</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Most Played Songs</h3>
                      <div className="space-y-2">
                        {userStats.topSongs && userStats.topSongs.length > 0 ? (
                          userStats.topSongs.map((song, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-900/60 p-3 rounded-lg">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-melody-pink-800 flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="text-white">{song.name}</p>
                                  <p className="text-gray-400 text-sm">{song.artist}</p>
                                </div>
                              </div>
                              <span className="text-gray-400">{song.count} plays</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 italic">No song data available yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <h2 className="text-xl font-bold text-white">Your Preferences</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Favorite Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {listeningPreferences.length > 0 ? (
                          listeningPreferences.map((pref, index) => (
                            <span 
                              key={index} 
                              className="bg-melody-pink-900/60 px-3 py-1 rounded-full text-white"
                            >
                              {pref}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400 italic">No preferences set yet</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Sound Quality Preferences</h3>
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white">Streaming Quality</span>
                          <span className="text-melody-pink-500 font-medium">High</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white">Download Quality</span>
                          <span className="text-melody-pink-500 font-medium">HD</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="w-full px-4 py-3 bg-melody-pink-600 text-white rounded-lg hover:bg-melody-pink-500 transition-colors">
                        Update Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    <h2 className="text-xl font-bold text-white">Your Subscription</h2>
                  </div>
                  
                  <div className="bg-gradient-to-r from-melody-pink-900 to-purple-900 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">Free Plan</h3>
                        <p className="text-gray-200">Basic features with ads</p>
                      </div>
                      <div className="bg-white text-melody-pink-900 px-3 py-1 rounded-full font-bold">
                        ACTIVE
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white">Basic streaming quality</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white">Ad-supported listening</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white">No offline listening</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-white text-melody-pink-900 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                      Upgrade to Premium
                    </button>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-6 border border-melody-pink-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Premium Benefits</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white">Ad-free music listening</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white">HD audio quality</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white">Download songs for offline listening</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white">Unlimited skips</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Logout Section */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiLogOut className="text-red-500 mr-3" size={20} />
                    <h2 className="text-xl font-bold text-white">Sign Out</h2>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors flex items-center"
                  >
                    <FiLogOut className="mr-2" /> Sign Out
                  </button>
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
