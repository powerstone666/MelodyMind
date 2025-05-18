import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useMediaQuery from "../useMedia";
import ProtectedRoute from './ProtectedRoute';

// Page components
import Home from "../Home/home";
import Discover from "../Discover/discover";
import AlbumFull from "../Albumsongs/albumfull";
import Inneralbum from "../Albumsongs/inneralbum";
import ArtistPage from "../Playlist/artist_redesigned";
import Innerartist from "../Playlist/innerartist_redesigned";
import Searchfunc from "../Search/search";
import Moodanalyse from "../moodanalyse";
import Innersongs from "../AudioPlayer/innersongs";
import AboutUs from "../about";
import ContactUs from "../contact";
import Login from "../login_redesigned";
import Signup from "../signup_redesigned";
import Profile from "../profile_redesigned";
import Likes from "../Library/likes";
import Recents from "../Library/recents";

function AppRoutes() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/albums" element={<AlbumFull />} />
      <Route path="/innerAlbum" element={<Inneralbum />} />
      <Route path="albums/innerAlbum" element={<Inneralbum />} />
      {isAboveMedium && <Route path="/artist" element={<ArtistPage />} />}
      <Route path="/innerartist" element={<Innerartist />} />
      <Route path="/search" element={<Searchfunc />} />
      <Route path="/mood" element={<Moodanalyse />} />
      <Route path="/innersong" element={<Innersongs />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
        {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/recently" element={<Recents />} />
        <Route path="/liked" element={<Likes />} />
        <Route path="/profile" element={<Profile />} />
        {/* Add more protected routes here */}
      </Route>
      
      {/* Redirect any unmatched routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
