import { fetchHistory, deleteRecents } from "../Firebase/database";
import useMediaQuery from "../useMedia";
import { useEffect, useState, useContext } from "react";
import { Context } from "../context.js";

function Recents() {
  const [likes, setLikes] = useState([]);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const localUser = JSON.parse(localStorage.getItem("Users"));  useEffect(() => {
    const fetchLikes = async () => {
      try {
        let res = await fetchHistory();

        // Sort the items in descending order (newest first) for display
        res = res.sort((a, b) => b.timestamp - a.timestamp);

        // Limit to only the 50 most recent songs
        if (res.length > 50) {
          // Take only the first 50 songs (newest ones)
          const recentSongs = res.slice(0, 50);
          
          // Delete older songs from the database
          for (let i = 50; i < res.length; i++) {
            await deleteRecents(res[i].id);
          }
          
          // Update the state with only the 50 most recent songs
          setLikes(recentSongs);
        } else {
          // If there are 50 or fewer songs, use them all
          setLikes(res);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or deleting likes:', error);
        setLoading(false);
      }
    };

    fetchLikes();
  }, []); // Empty dependency array ensures this runs once on mount


  const play = (id) => {
    localStorage.setItem("songid", id);
    setSongid(id);
  };

  const deleteRecent = async (id) => {
    try {
      await deleteRecents(id);
      // Update the likes state after deletion
      setLikes(likes.filter((song) => song.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!loading ? (
        <>
          {localUser ? (
            <>
              {isAboveMedium ? (
                <div className="h-screen w-5/6 m-12 mb-28 flex flex-col bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 shadow-lg rounded-lg overflow-y-auto no-scrollbar pb-36">
                  <div className="w-full flex flex-col md:flex-row items-center p-6 bg-gradient-to-tr from-deep-grey via-deep-blue to-deep-blue border-b border-gray-700 shadow-md">
                    <div className="flex items-center justify-center h-36 w-36 rounded-lg shadow-lg bg-melody-pink-500/20 border border-melody-pink-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-melody-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                      <h1 className="font-bold text-2xl md:text-3xl text-white">
                        Recently <span className="text-melody-pink-500">Played</span>
                      </h1>
                      <p className="text-gray-300 mt-2">
                        {likes.length} Songs • Listen History
                      </p>
                    </div>
                  </div>                  {localUser &&
                    likes.map((song, index) => (
                      <div
                        className="flex items-center gap-4 p-4 m-2 rounded-lg bg-deep-grey/50 hover:bg-melody-pink-600/20 transition-all duration-300 cursor-pointer transform hover:scale-[1.01]"
                        key={song.id}
                      >
                        <span className="text-sm w-8 text-gray-400 text-center">#{index + 1}</span>
                        <img 
                          src={song.songUrl} 
                          className="h-12 w-12 rounded-md object-cover" 
                          alt={song.songName}
                        /><div className="flex-grow">                          <h3 className="text-white font-medium">{song.songName}</h3>
                          <p className="text-sm text-gray-400">
                            {song.songYear || (song.timestamp && !isNaN(new Date(song.timestamp).getFullYear()) ? 
                              new Date(song.timestamp).getFullYear() : 
                              "Recent")}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className="p-2 hover:bg-melody-pink-500/20 rounded-full transition-all duration-300 mr-2"
                            onClick={() => play(song.songId)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRecent(song.id);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  <div className="h-36 mb-32"></div>
                </div>
              ) : (
                <div className="h-screen w-full mb-28 flex flex-col bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 shadow-lg overflow-y-auto no-scrollbar pb-32">
                  <div className="w-full flex flex-col items-center p-4 bg-gradient-to-tr from-deep-grey via-deep-blue to-deep-blue border-b border-gray-700 shadow-md">
                    <div className="flex items-center justify-center h-28 w-28 rounded-lg shadow-lg bg-melody-pink-500/20 border border-melody-pink-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-melody-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center">
                      <h1 className="font-bold text-xl text-white">
                        Recently <span className="text-melody-pink-500">Played</span>
                      </h1>
                      <p className="text-gray-300 text-sm mt-1">
                        {likes.length} Songs
                      </p>
                    </div>
                  </div>
                  <div className="p-2">                    {localUser && likes.map((song, index) => (
                      <div
                        className="flex items-center gap-3 p-3 mx-2 my-1 rounded-lg bg-deep-grey/50 hover:bg-melody-pink-600/20 transition-all duration-300 cursor-pointer"
                        key={song.id}
                      >
                        <span className="text-xs w-6 text-gray-400 text-center">#{index + 1}</span>
                        <img 
                          src={song.songUrl} 
                          className="h-10 w-10 rounded-md object-cover" 
                          alt={song.songName}
                        /><div className="flex-grow min-w-0">                          <h3 className="text-white text-sm font-medium truncate">{song.songName}</h3>
                          <p className="text-xs text-gray-400 truncate">
                            {song.songYear || (song.timestamp && !isNaN(new Date(song.timestamp).getFullYear()) ? 
                              new Date(song.timestamp).getFullYear() : 
                              "Recent")}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button 
                            className="p-1 text-melody-pink-500 hover:bg-melody-pink-500/20 rounded-full transition-all duration-300 mr-1"
                            onClick={() => play(song.songId)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button 
                            className="p-1 text-gray-400 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRecent(song.id);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="h-36 mb-32"></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <h1 className="text-red text-3xl font-bold">
              Login to view your Recents
            </h1>
          )}
        </>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </>
  );
}

export default Recents;
