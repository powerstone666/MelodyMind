// Recent Activity component for profile page
import React from 'react';
import { Link } from 'react-router-dom';

const RecentActivity = ({ recentSongs, loading }) => {  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Recent';
    
    try {
      // Firebase Timestamp
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp.seconds) {
        // Firebase timestamp object
        date = new Date(timestamp.seconds * 1000);
      } else {
        // Regular timestamp number or Date object
        date = new Date(timestamp);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Recent';
      }
      
      // If today, show time only
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const songDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      if (songDate.getTime() === today.getTime()) {
        return `Today at ${date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}`;
      }
      
      // If yesterday, show "Yesterday"
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (songDate.getTime() === yesterday.getTime()) {
        return `Yesterday at ${date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}`;
      }
      
      // Otherwise show date and time
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-deep-grey/30 p-4 rounded-lg border border-gray-700">
        <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="rounded-md bg-deep-grey/60 h-10 w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-deep-grey/60 rounded w-3/4"></div>
                <div className="h-3 bg-deep-grey/60 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recentSongs || recentSongs.length === 0) {
    return (
      <div className="w-full bg-deep-grey/30 p-4 rounded-lg border border-gray-700">
        <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
        <div className="flex flex-col items-center justify-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-gray-400 text-center">No recent activity yet. Start playing songs!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-deep-grey/30 p-4 rounded-lg border border-gray-700">
      <h3 className="text-white font-semibold mb-4">Recently Played</h3>
      <div className="space-y-3">
        {recentSongs.map((song) => (
          <Link 
            key={song.id} 
            to={`/innerAlbum`}
            onClick={() => {
              localStorage.setItem("songid", song.songId);
              // If you have a global context to set the song
              // setSongId(song.songId);
            }}
            className="flex items-start space-x-3 p-2 rounded-lg hover:bg-deep-grey/40 transition-colors duration-200"
          >            <img 
              src={song.imageUrl || "https://via.placeholder.com/40?text=Music"} 
              alt={song.songName} 
              className="h-10 w-10 rounded-md object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{song.songName}</p>
              <p className="text-gray-400 text-xs truncate">{song.artistName || "Unknown Artist"}</p>
              <p className="text-gray-500 text-xs mt-1">{formatTime(song.timestamp)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
