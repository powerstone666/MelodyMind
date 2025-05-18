import React, { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../context.js"; // Updated import
import useMediaQuery from "../useMedia";
import { searchResult, newsearch, searchSuggestion } from "../saavnapi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLyrics } from "../gemini";
import { getSongRecommendations } from "../gemini";
import he from "he";
import { addLikes, deleteLikes, fetchUser } from "../Firebase/database";
import { recordUserActivity } from "../Firebase/userProfile";
import { auth } from "../Firebase/firebaseConfig";

function Innersongs() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const { songid, lyrics, setLyrics, setSongid, spotify, setSpotify } =
    useContext(Context);
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [songName, setSongName] = useState("");
  const [midsection, setMidsection] = useState("song");
  const [recommendation, setRecommendation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dloading, setDloading] = useState(false);
  const [download, setDownload] = useState("");
  const [liked, setLiked] = useState(false);
  const [dbId, setDbId] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetchUser();
        const foundSong = res.find((song) => song.songId === songid);
        if (foundSong) {
          setLiked(true);
          setDbId(foundSong.id);
        } else {
          setLiked(false);
          setDbId("");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchLikes();
  }, [songid]);

  const downloadAudio = async () => {
    const url = download;
    try {
      setDloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${songName}.mp3`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDloading(false);
      toast.success("Downloaded Successfully");
    } catch (error) {
      console.error("Error downloading audio:", error);
      toast.error("Download Failed");
      setDloading(false);
    }
  };

  const fetchLyrics = useCallback(async () => {
    setLoading(false);
    if (songid) {
      try {
        const res = await searchResult(songid);
        const songData = res.data.data[0];

        setDetails(songData);
        setSongName(songData.name);
        setDownload(songData.downloadUrl[4].url);
        console.log(songData)
        const lyricdata = await getLyrics(
          songData.artists.all[0].name,
          songData.name,
          songData.album.name,
          songData.year,
         songData.language
        );
        const decodedName = he.decode(songData.name);
       
        setImage(songData.image[2].url);
         setSongName(decodedName);
        
        setLyrics(lyricdata);
      } catch (error) {
        setLyrics("Lyrics Not found");
      }
    }
    setLoading(true);
  }, [songid, setLyrics]);
  const fetchRecommendations = useCallback(async () => {
      if (
        details &&
        details.name &&
        details.artists &&
        details.artists.all &&
        details.artists.all[0] &&
        details.artists.all[0].name
      ) {
        try {
          const rec = await getSongRecommendations(
            details.name,
            details.artists.all[0].name
          );

          if (typeof rec === "string") {
             setRecommendation(JSON.parse(rec).map(item => ({...item, song:item.song.replace(/['"]/g,''),artist:item.artist.replace(/['"]/g,'')})));
          } else {
            setRecommendation(rec.map(item => ({...item, song:item.song.replace(/['"]/g,''),artist:item.artist.replace(/['"]/g,'')})));
          }
           
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      }
       
  }, [details]);
  useEffect(() => {
    if (details.name) {
        fetchRecommendations();
    }
  }, [details.name, fetchRecommendations]);


  useEffect(() => {
    fetchLyrics();
  }, [songid, fetchLyrics]);

  const play = async (songName) => {
      try {
          const res = await newsearch(songName);
          localStorage.setItem("spotify", songName);
          setSpotify(songName);
          localStorage.setItem("songid", res);
          setSongid(res);
          // Add a toast notification for better user feedback
          toast.success(`Playing: ${songName}`, {
              position: "top-center",
              autoClose: 2000
          });
      } catch (error) {
          console.error("Error playing song:", error);
          toast.error("Failed to play song. Please try again.");
      }
  };

  const style = `text-white bg-melody-pink-600 border-0 rounded-xl shadow-inner shadow-melody-pink-500/30`;  const handleLikes = async () => {
    try {
      setLiked(true);
      const name = he.decode(details.name);
      const image = details.image?.[2]?.url;
      const year = details.year;
      const songId = songid;
      
      // Add song to liked songs database
      await addLikes(songId, name, image, year, auth.currentUser.uid);
      
      // Record like activity for user statistics
      if (auth.currentUser) {
        await recordUserActivity(
          auth.currentUser.uid,
          songId,
          name,
          details.primaryArtists || "Unknown Artist",
          "liked",
          image
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to like song");
    }
  };
  const handleDelete = async () => {
    try {
      setLiked(false);
      await deleteLikes(dbId);
      
      // Record unlike activity (optional)
      if (auth.currentUser) {
        const name = he.decode(details.name);
        const image = details.image?.[2]?.url;
        
        await recordUserActivity(
          auth.currentUser.uid,
          songid,
          name,
          details.primaryArtists || "Unknown Artist",
          "unliked",
          image
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlike song");
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center h-screen overflow-y-scroll no-scrollbar mb-24">
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          {isAboveMedium ? (
            <>
              <div className="border-1 bg-melody-purple-800 border border-melody-purple-700 rounded-lg h-1/2 mb-6 p-4 ">
                <img src={image} alt="song" className="h-full" />
              </div>
              <div className="flex gap-4 items-center justify-center mb-6">
                <h1 className="text-xl ">{songName}</h1>
                <div className="flex flex-row items-center gap-3">
                  {!dloading ? (
                    <>
                      {liked ? (
                        <button onClick={handleDelete}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/16887/16887092.png"
                            className="h-8"
                            alt="Unlike"
                          />
                        </button>
                      ) : (
                        <button onClick={handleLikes}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/3641/3641323.png"
                            className="h-8"
                            alt="Like"
                          />
                        </button>
                      )}
                      <button onClick={downloadAudio}>
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/2810/2810387.png"
                          className="h-8"
                          alt="Download"
                        />
                      </button>
                    </>
                  ) : (
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                      className="animate-spin h-8"
                      alt="Loading"
                    />
                  )}
                </div>
              </div>
              <div className="h-14 bg-melody-purple-800 flex justify-center w-96 border border-melody-purple-700 rounded-xl items-center mb-8">
                <div
                  className={`${
                    midsection === "song" ? style : ""
                  } w-1/2 h-full p-4 flex justify-center cursor-pointer`}
                  onClick={() => setMidsection("song")}
                >
                  <h1>Song</h1>
                </div>
                <div
                  className={`${
                    midsection === "lyric" ? style : ""
                  } w-1/2 p-4 flex justify-center cursor-pointer `}
                  onClick={() => setMidsection("lyric")}
                >
                  <h1>Lyrics</h1>
                </div>
              </div>
              {midsection === "song" && (
                <div>
                  {recommendation.map((song, index) => (
                    <div
                      className="bg-melody-purple-800 flex items-center p-4 m-2 cursor-pointer rounded-lg border border-melody-purple-700 hover:border-melody-pink-600/50 hover:shadow-melody-pink-600/30 hover:shadow-md transition-all duration-300"
                      key={index}
                      onClick={() => play(song.song)}
                    >
                      <h1 className="text-sm w-12">#{index + 1}</h1>
                      <div className="flex flex-col flex-grow ml-4 gap-1">
                            <h1 className="text-md font-bold">{song.song}</h1>
                            <h1 className="text-xs font-semibold text-gray-400">{song.artist} <span className="font-normal">{song.movie && `~ ${song.movie}`}</span>
                            </h1>
                         
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {midsection === "lyric" && (
                <div>
                  <h1 className="text-3xl mb-2">
                    Movie: {""}{" "}
                    <span className="text-red">{he.decode(details.name)}</span>
                  </h1>
                  <h1 className="text-3xl mb-4">
                    Year: {""} <span className="text-red">{details.year}</span>
                  </h1>
                   <div className="text-xl whitespace-pre-line no-scrollbar">
                     {lyrics ? lyrics : "Lyrics Not found"}
                    </div>
                 
                </div>
              )}
            </>
          ) : (
            <>
              <div className="border-1 bg-melody-purple-800 border border-melody-purple-700 rounded-lg h-2/6 mb-6 p-4 flex-col">
                <img src={image} alt="song" className="h-full" />
              </div>
              <div className="flex gap-4 items-center justify-center mb-6">
                <h1 className="text-xl ">{songName}</h1>
                <div className="flex flex-row items-center gap-3">
                  {!dloading ? (
                    <>
                      {liked ? (
                        <button onClick={handleDelete}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/16887/16887092.png"
                            className="h-8"
                            alt="Unlike"
                          />
                        </button>
                      ) : (
                        <button onClick={handleLikes}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/3641/3641323.png"
                            className="h-8"
                            alt="Like"
                          />
                        </button>
                      )}
                      <button onClick={downloadAudio}>
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/2810/2810387.png"
                          className="h-8"
                          alt="Download"
                        />
                      </button>
                    </>
                  ) : (
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                      className="animate-spin h-8"
                      alt="Loading"
                    />
                  )}
                </div>
              </div>              <div className="flex bg-gradient-to-br from-deep-grey to-deep-blue rounded-lg overflow-hidden border border-gray-700 mb-6 shadow-md">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all duration-300 ${
                    midsection === "song" 
                      ? "bg-melody-pink-500 text-white" 
                      : "text-gray-400 hover:bg-deep-grey/60"
                  }`}
                  onClick={() => setMidsection("song")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span className="font-medium">Recommendations</span>
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all duration-300 ${
                    midsection === "lyric" 
                      ? "bg-melody-pink-500 text-white" 
                      : "text-gray-400 hover:bg-deep-grey/60"
                  }`}
                  onClick={() => setMidsection("lyric")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">Lyrics & Info</span>
                </button>
              </div>{midsection === "song" && (
                <div className="mb-36">
                  {recommendation.map((song, index) => (
                      <div 
                        className="bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 hover:border-melody-pink-500/50 flex items-center p-4 m-2 cursor-pointer rounded-lg shadow-md hover:shadow-melody-pink-500/20 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
                        key={index} 
                        onClick={() => play(song.song)}
                      >
                         <div className="text-sm w-8 text-gray-400 text-center font-medium">#{index + 1}</div>
                         <div className="flex-grow px-4">
                           <h3 className="text-white font-medium mb-1">{song.song}</h3>
                           <div className="flex items-center text-xs text-gray-400">
                             <span className="font-medium text-melody-pink-400">{song.artist}</span>
                             {song.movie && (
                               <>
                                 <span className="mx-1.5">•</span>
                                 <span>{song.movie}</span>
                               </>
                             )}
                           </div>
                         </div>
                         <div className="p-2 rounded-full bg-melody-pink-500/20 text-melody-pink-500">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                         </div>
                      </div>
                    ))}
                </div>
              )}              {midsection === "lyric" && (
                <div className="mb-36">
                  <div className="bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 p-6 m-2 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                      <div className="rounded-full bg-melody-pink-500/20 p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-md font-medium text-white">Song Info</h2>
                        <p className="text-sm text-gray-400">Details about this track</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-1">Title</span>
                        <span className="text-white font-medium">{he.decode(details.name)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-1">Release Year</span>
                        <span className="text-white font-medium">{details.year}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-1">Album</span>
                        <span className="text-white font-medium">{details.album && he.decode(details.album.name)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-1">Language</span>
                        <span className="text-white font-medium">{details.language}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="rounded-full bg-melody-pink-500/20 p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-md font-medium text-white">Lyrics</h2>
                        <p className="text-sm text-gray-400">Song lyrics</p>
                      </div>
                    </div>
                    
                    <div className="bg-deep-grey/50 rounded-lg p-4 mt-2 max-h-96 overflow-y-auto custom-scrollbar">
                      <div className="text-md whitespace-pre-line text-gray-200">
                        {lyrics ? lyrics : 
                          <div className="flex flex-col items-center py-6 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Lyrics not found for this song</span>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <h1 className="text-2xl text-red">Loading....</h1>
      )}
    </>
  );
}

export default Innersongs;
