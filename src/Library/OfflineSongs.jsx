import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context.js";
import { removeSongFromOffline, getOfflineSongs } from "../utils/serviceWorkerUtils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function OfflineSongs() {
  const { setSongid, setSpotify } = useContext(Context);
  const [offlineSongsList, setOfflineSongsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOfflineSongs();
  }, []);

  const loadOfflineSongs = () => {
    setLoading(true);
    try {
      const songs = getOfflineSongs();
      setOfflineSongsList(songs);
    } catch (error) {
      console.error("Error loading offline songs:", error);
      toast.error("Failed to load offline songs");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (url) => {
    try {
      await removeSongFromOffline(url);
      loadOfflineSongs(); // Reload the list
      toast.success("Song removed from offline library");
    } catch (error) {
      console.error("Error removing song from offline library:", error);
      toast.error("Failed to remove from offline library");
    }
  };

  const playSong = (song) => {
    if (song.metadata && song.metadata.songId) {
      localStorage.setItem("songid", song.metadata.songId);
      setSongid(song.metadata.songId);
      
      if (song.metadata.name) {
        localStorage.setItem("spotify", song.metadata.name);
        setSpotify(song.metadata.name);
      }
      
      navigate("/innersongs");
      toast.success(`Playing: ${song.metadata.name}`, {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      toast.error("Cannot play this song");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-60 bg-gradient-to-br from-deep-grey to-deep-blue">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Offline Songs</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-melody-pink-500"></div>
          </div>
        ) : offlineSongsList.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <img 
                src="https://cdn-icons-png.flaticon.com/128/6134/6134065.png" 
                alt="No offline songs" 
                className="w-24 h-24 mx-auto opacity-60"
              />
            </div>
            <p className="text-gray-300 text-lg">No songs saved for offline playback</p>
            <p className="text-gray-400 mt-2">
              Save songs for offline listening by tapping the cloud icon when viewing a song
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-530px)] ">
            {offlineSongsList.map((song, index) => (
              <div 
                key={index} 
                className="bg-melody-purple-800 border border-melody-purple-700 rounded-lg overflow-hidden shadow-lg hover:shadow-melody-pink-500/20 transition-all duration-300"
              >
                <div className="flex">
                  <div 
                    className="w-24 h-24 bg-melody-purple-900 flex-shrink-0 cursor-pointer"
                    onClick={() => playSong(song)}
                  >
                    {song.metadata?.image ? (
                      <img 
                        src={song.metadata.image} 
                        alt={song.metadata.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 
                        className="text-white font-semibold truncate cursor-pointer hover:text-melody-pink-400"
                        onClick={() => playSong(song)}
                      >
                        {song.metadata?.name || "Unknown Song"}
                      </h3>
                      <p className="text-gray-400 text-sm">{song.metadata?.artist || "Unknown Artist"}</p>
                      {song.metadata?.album && (
                        <p className="text-gray-500 text-xs">{song.metadata.album}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {song.metadata?.language || "Unknown"}
                        {song.metadata?.year ? ` • ${song.metadata.year}` : ""}
                      </span>
                      <button 
                        onClick={() => handleRemove(song.url)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove from offline library"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-melody-purple-900 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-melody-pink-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    <span className="text-xs text-gray-400">Saved offline</span>
                  </div>
                  <button 
                    onClick={() => playSong(song)}
                    className="bg-melody-pink-600 hover:bg-melody-pink-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    title="Play song"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )} {/* End of conditional rendering for song list */}

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Offline songs are available even when you don't have an internet connection
          </p>
        </div>
      </div>
    </div>
  );
}

export default OfflineSongs;
