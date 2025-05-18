import React, { useState, useEffect, useContext } from "react";
import useMediaQuery from "../useMedia";
import { Context } from "../context.js";
import he from "he";
import { artistSongs } from "../saavnapi";
import { Link } from "react-router-dom";
import { addRecents } from '../Firebase/database';
import { FiPlay, FiMusic, FiDisc, FiCalendar, FiClock, FiHeart } from 'react-icons/fi';

// Helper function to format duration from seconds to mm:ss
const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

function Innerartist({ names }) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid, singer, setInneralbum, setSelected } = useContext(Context);
  const [artistData, setArtistData] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [albumLimit, setAlbumLimit] = useState(6);

  // Function to handle expanding to show more results
  const expandSongResults = () => {
    setLimit(topSongs.length);
  };

  const expandAlbumResults = () => {
    setAlbumLimit(topAlbums.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!singer) return;
      
      try {
        const res = await artistSongs(singer);
        const data = res?.data?.data || {};
        setArtistData(data);
        
        // Process top songs with proper null checks
        if (data.topSongs && Array.isArray(data.topSongs)) {
          setTopSongs(
            data.topSongs.map((song) => ({
              id: song.id || '',
              name: song.name ? he.decode(song.name) : 'Unknown Song',
              image: song.image && song.image.length > 0 ? 
                    (song.image[2]?.url || song.image[1]?.url || song.image[0]?.url || '') : 
                    '',
              artist: song.artists?.primary?.[0]?.name || 'Unknown Artist',
              year: song.year || '',
              duration: song.duration || 0,
              hasLyrics: !!song.hasLyrics
            }))
          );
        } else {
          setTopSongs([]);
        }
        
        // Process top albums with proper null checks
        if (data.topAlbums && Array.isArray(data.topAlbums)) {
          setTopAlbums(
            data.topAlbums.map((album) => ({
              id: album.id || '',
              name: album.name ? he.decode(album.name) : 'Unknown Album',
              image: album.image && album.image.length > 0 ? 
                    (album.image[2]?.url || album.image[1]?.url || album.image[0]?.url || '') : 
                    '',
              artist: album.artists?.primary?.[0]?.name || 'Unknown Artist',
              year: album.year || '',
              songCount: album.songCount || 0
            }))
          );
        } else {
          setTopAlbums([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [singer]);

  const handleSongPlay = async (songId, songName, image) => {
    localStorage.setItem("songid", songId);
    setSongid(songId);
    
    const user = JSON.parse(localStorage.getItem("Users"));
    if (user) {
      await addRecents(user.uid, songId, songName, image);
    }
  };

  const handleAlbumClick = (albumId) => {
    localStorage.setItem("inneralbum", albumId);
    setInneralbum(albumId);
    localStorage.setItem("selected", "/inneralbum");
    setSelected("/inneralbum");
  };

  if (loading) {
    return (
      <div className="w-full p-4 md:p-8 overflow-y-auto">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row mb-6 items-center md:items-start">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-800 mb-4 md:mb-0 md:mr-6"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-800 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-64 mt-4"></div>
            </div>
          </div>
          
          <div className="h-6 bg-gray-800 rounded w-40 my-6"></div>
          
          <div className="space-y-3">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-3 flex flex-col md:flex-row md:items-center">
                <div className="h-16 w-16 bg-gray-700 rounded mb-3 md:mb-0 md:mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full p-4 md:p-8 overflow-y-auto h-screen pb-24">
      {/* Artist Header */}
      {artistData && (
        <div className="flex flex-col md:flex-row items-center md:items-start mb-10">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-800 shadow-lg mb-5 md:mb-0 md:mr-8">
            <img 
              src={artistData?.image ? (artistData.image[2]?.url || artistData.image[1]?.url || artistData.image[0]?.url || '') : ''}
              alt={artistData?.name || 'Artist'}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Artist'; }}
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{artistData?.name || 'Artist'}</h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              {artistData?.availableLanguages?.map((language, index) => (
                <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                  {language}
                </span>
              ))}
            </div>            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-400">
              <div className="flex items-center">
                <FiMusic className="mr-2 text-melody-pink-500" />
                <span>{topSongs?.length ? topSongs.length.toLocaleString() : (artistData?.topSongsCount ? Number(artistData.topSongsCount).toLocaleString() : '0')} songs</span>
              </div>
              
              <div className="flex items-center">
                <FiDisc className="mr-2 text-melody-pink-500" />
                <span>{topAlbums?.length ? topAlbums.length.toLocaleString() : (artistData?.topAlbumsCount ? Number(artistData.topAlbumsCount).toLocaleString() : '0')} albums</span>
              </div>
              
              {artistData?.fanCount && (
                <div className="flex items-center">
                  <FiHeart className="mr-2 text-melody-pink-500" />
                  <span>{Number(artistData.fanCount).toLocaleString()} fans</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Top Songs Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <FiMusic className="mr-2 text-melody-pink-500" /> Top Songs
        </h2>
        
        <div className="space-y-3">
          {topSongs.slice(0, limit).map((song, index) => (
            <div 
              key={index}
              className="group bg-gray-900/40 hover:bg-melody-pink-900/20 border border-gray-800 hover:border-melody-pink-800 rounded-lg p-3 md:p-4 transition-colors duration-300"
              onClick={() => handleSongPlay(song.id, song.name, song.image)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0">
                  <img 
                    src={song.image} 
                    alt={song.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 flex items-center justify-center transition-opacity rounded-md">
                    <FiPlay className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate group-hover:text-melody-pink-500 transition-colors">
                    {song.name}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-400 text-sm">
                  {song.hasLyrics && (
                    <div className="hidden md:block px-2 py-1 bg-gray-800 rounded text-xs">
                      Lyrics
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <FiClock className="mr-1 text-gray-500" size={14} />
                    <span>{formatDuration(song.duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {topSongs.length > limit && (
          <div className="flex justify-center mt-8">
            <button
              onClick={expandSongResults}
              className="px-6 py-2 border border-melody-pink-600 text-melody-pink-500 hover:bg-melody-pink-600 hover:text-white rounded-full transition-colors duration-300"
            >
              View More Songs
            </button>
          </div>
        )}
      </div>
      
      {/* Albums Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <FiDisc className="mr-2 text-melody-pink-500" /> Albums
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {topAlbums.slice(0, albumLimit).map((album, index) => (
            <Link
              to="/inneralbum"
              key={index}
              onClick={() => handleAlbumClick(album.id)}
              className="group"
            >
              <div className="bg-gray-900/40 hover:bg-melody-pink-900/20 border border-gray-800 hover:border-melody-pink-800 rounded-lg p-3 transition-all duration-300">
                <div className="relative mb-3 overflow-hidden rounded-md aspect-square">
                  <img 
                    src={album.image} 
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Album'; }}
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 flex items-center justify-center transition-opacity">
                    <div className="bg-melody-pink-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300">
                      <FiPlay className="text-white" size={18} />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-white font-medium line-clamp-1 group-hover:text-melody-pink-500 transition-colors">
                  {album.name}
                </h3>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-400 text-xs">
                    {album.songCount} {album.songCount === 1 ? 'song' : 'songs'}
                  </p>
                  
                  <div className="flex items-center text-gray-400 text-xs">
                    <FiCalendar className="mr-1" size={12} />
                    <span>{album.year}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {topAlbums.length > albumLimit && (
          <div className="flex justify-center mt-8">
            <button
              onClick={expandAlbumResults}
              className="px-6 py-2 border border-melody-pink-600 text-melody-pink-500 hover:bg-melody-pink-600 hover:text-white rounded-full transition-colors duration-300"
            >
              View More Albums
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Innerartist;
