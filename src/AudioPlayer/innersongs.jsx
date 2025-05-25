import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { Context } from "../context.js";
import useMediaQuery from "../useMedia";
import { searchResult, newsearch } from "../saavnapi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLyrics, getSongRecommendations } from "../gemini";
import he from "he";
import { addLikes, deleteLikes, fetchUser } from "../Firebase/database";
import { recordUserActivity } from "../Firebase/userProfile";
import { auth } from "../Firebase/firebaseConfig";
import { saveSongForOffline, removeSongFromOffline, isSongAvailableOffline } from "../utils/serviceWorkerUtils";

function Innersongs() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const { songid, lyrics, setLyrics, setSongid, spotify, setSpotify } = useContext(Context);
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
  const [savedOffline, setSavedOffline] = useState(false);
  const [savingOffline, setSavingOffline] = useState(false);

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
    if (!songid) {
      setDetails("");
      setImage("");
      setSongName("");
      setLyrics("");
      setRecommendation([]);
      setDownload(""); // Clear download URL
      setLoading(false); // Not loading if no songid
      return;
    }

    setLoading(true); // Indicate loading has started
    try {
      const res = await searchResult(songid);
      if (!res.data.data || !res.data.data[0]) {
        console.error("Song data not found for songid:", songid);
        throw new Error("Song data not found");
      }
      const songData = res.data.data[0];

      setDetails(songData); // This will trigger fetchRecommendations effect
      const decodedName = he.decode(songData.name);
      setSongName(decodedName);
      // Ensure downloadUrl and image arrays are accessed safely
      setDownload(songData.downloadUrl?.[4]?.url || "");
      setImage(songData.image?.[2]?.url || "");

      // Fetch lyrics after setting basic song details
      const lyricdata = await getLyrics(
        songData.artists?.all?.[0]?.name || songData.primaryArtists || "Unknown Artist",
        songData.name, // Use original name for lyrics API
        songData.album?.name || "Unknown Album",
        songData.year || "N/A",
        songData.language || "N/A"
      );
      setLyrics(lyricdata);
    } catch (error) {
      console.error("Error in fetchLyrics for songid:", songid, error);
      // Reset states to a clean slate on error
      setDetails("");
      setImage("");
      setSongName("Error loading song");
      setLyrics("Lyrics Not found");
      setRecommendation([]);
      setDownload("");
    } finally {
      setLoading(false); // Indicate loading has finished
    }
  }, [songid, setLyrics, setDetails, setSongName, setImage, setDownload, setRecommendation]);

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
          setRecommendation(
            JSON.parse(rec).map((item) => ({
              ...item,
              song: item.song.replace(/['"]/g, ""),
              artist: item.artist.replace(/['"]/g, ""),
            }))
          );
        } else {
          setRecommendation(
            rec.map((item) => ({
              ...item,
              song: item.song.replace(/['"]/g, ""),
              artist: item.artist.replace(/['"]/g, ""),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    }
  }, [details]);

  useEffect(() => {
    // if (details.name) { // This check is implicitly handled by details dependency
    fetchRecommendations();
    // }
  }, [details, fetchRecommendations]); // Depend on the 'details' object directly

  useEffect(() => {
    fetchLyrics();
  }, [fetchLyrics]); // Depends on the fetchLyrics callback, which correctly depends on songid and setters

  // Check if song is saved offline
  useEffect(() => {
    if (download) {
      const isAvailable = isSongAvailableOffline(download);
      setSavedOffline(isAvailable);
    }
  }, [download]);  const play = async (songName, expectedSongName = null, expectedArtistName = null, expectedAlbumName = null) => {
    try {
      const res = await newsearch(songName, expectedSongName, expectedArtistName, expectedAlbumName);
      localStorage.setItem("spotify", songName);
      setSpotify(songName);
      localStorage.setItem("songid", res);
      setSongid(res);
      toast.success(`Playing: ${songName}`, {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error playing song:", error);
      toast.error("Failed to play song. Please try again.");
    }
  };

  const style = `text-white bg-melody-pink-600 border-0 rounded-xl shadow-inner shadow-melody-pink-500/30`;

  const handleLikes = async () => {
    if (!auth.currentUser) {
      toast.error("Please sign in to like songs");
      return;
    }
    try {
      setLiked(true);
      const name = he.decode(details.name);
      const image = details.image?.[2]?.url;
      const year = details.year;
      const songId = songid;

      await addLikes(songId, name, image, year, auth.currentUser.uid);

      await recordUserActivity(
        auth.currentUser.uid,
        songId,
        name,
        details.primaryArtists || "Unknown Artist",
        "liked",
        image
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to like song");
      setLiked(false);
    }
  };

  const handleDelete = async () => {
    if (!auth.currentUser) {
      toast.error("Please sign in to unlike songs");
      return;
    }
    try {
      setLiked(false);
      await deleteLikes(dbId);

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
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlike song");
      setLiked(true);
    }
  };

  // Function to save song for offline playback
  const handleSaveOffline = async () => {
    if (savedOffline) {
      try {
        setSavingOffline(true);
        await removeSongFromOffline(download);
        setSavedOffline(false);
        toast.success("Song removed from offline library");
      } catch (error) {
        console.error("Error removing song from offline library:", error);
        toast.error("Failed to remove from offline library");
      } finally {
        setSavingOffline(false);
      }
    } else {
      try {
        setSavingOffline(true);
        
        // Create metadata object for the song
        const metadata = {
          name: songName,
          artist: details.primaryArtists || "Unknown Artist",
          album: details.album ? he.decode(details.album.name) : "",
          year: details.year,
          image: image,
          songId: songid,
          language: details.language
        };
          await saveSongForOffline(download, metadata);
        setSavedOffline(true);
        toast.success("Song saved for offline playback");
        
        // Record user activity if logged in (optional)
        if (auth.currentUser) {
          try {
            await recordUserActivity(
              auth.currentUser.uid,
              songid,
              songName,
              details.primaryArtists || "Unknown Artist",
              "saved_offline",
              image
            );
          } catch (error) {
            console.log("User activity recording failed (non-critical):", error);
          }
        }
      } catch (error) {
        console.error("Error saving song for offline:", error);
        toast.error("Failed to save for offline playback");
      } finally {
        setSavingOffline(false);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-deep-blue">
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
      {!loading ? (
        // Main Content View
        <div className="flex-1 overflow-y-auto pb-32">
          {isAboveMedium ? (
            // Desktop View
            <div className="w-full max-w-6xl mx-auto mt-10 mb-20 bg-gradient-to-br from-deep-grey/90 to-deep-blue/95 rounded-3xl shadow-2xl p-0 overflow-hidden">
              {/* Banner with blur effect */}
              <div className="relative h-60 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-deep-blue"></div>
                
                {/* Song details overlay */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full flex items-center gap-8 p-8">
                    <div className="relative">
                      <img 
                        src={image} 
                        alt={songName} 
                        className="h-48 w-48 rounded-2xl object-cover shadow-2xl border-2 border-melody-purple-700/50 transform -translate-y-4 hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-melody-pink-600 rounded-full p-2 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-white mb-1">{songName}</h1>
                      </div>
                      {details.primaryArtists && (
                        <p className="text-gray-300 text-lg mb-1">{details.primaryArtists}</p>
                      )}
                      {details.album && (
                        <p className="text-gray-400 text-sm mb-4">
                          From album: <span className="text-melody-pink-400">{he.decode(details.album.name)}</span>
                          {details.year && ` • ${details.year}`}
                        </p>
                      )}
                      
                      {/* Action buttons in a nice row */}
                      <div className="flex gap-3 mb-4">
                        {!dloading ? (
                          <>
                            {/* Like/Unlike button */}
                            <button 
                              onClick={liked ? handleDelete : handleLikes} 
                              className={`flex items-center gap-1 px-4 py-2 rounded-full ${ liked ? 'bg-melody-pink-600 text-white' : 'bg-gray-800/70 text-white hover:bg-melody-pink-700'} transition-all`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={liked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>{liked ? 'Liked' : 'Like'}</span>
                            </button>
                            
                            {/* Download button */}
                            <button
                              onClick={downloadAudio}
                              className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-800/70 text-white hover:bg-melody-purple-700 transition-all"
                              disabled={dloading}
                            >
                              {dloading ? (
                                <>
                                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Downloading</span>
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                  <span>Download</span>
                                </>
                              )}
                            </button>
                            
                            {/* Save Offline button */}
                            <button
                              onClick={handleSaveOffline}
                              className={`flex items-center gap-1 px-4 py-2 rounded-full ${ savedOffline ? 'bg-melody-purple-700 text-white' : 'bg-gray-800/70 text-white hover:bg-melody-purple-700'} transition-all`}
                              disabled={savingOffline}
                            >
                              {savingOffline ? (
                                <>
                                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Processing</span>
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    {savedOffline && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />}
                                  </svg>
                                  <span>{savedOffline ? 'Saved Offline' : 'Save Offline'}</span>
                                </>
                              )}
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-white">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading song details...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tab navigation */}
              <div className="flex gap-1 border-b border-gray-700/50 px-8">
                <button
                  className={`px-6 py-4 font-semibold transition-all duration-300 relative ${
                    midsection === "song"
                      ? "text-melody-pink-500"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setMidsection("song")}
                >
                  Recommendations
                  {midsection === "song" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-melody-pink-500"></span>
                  )}
                </button>
                <button
                  className={`px-6 py-4 font-semibold transition-all duration-300 relative ${
                    midsection === "lyric"
                      ? "text-melody-pink-500"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setMidsection("lyric")}
                >
                  Lyrics & Info
                  {midsection === "lyric" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-melody-pink-500"></span>
                  )}
                </button>
              </div>
              {midsection === "song" && (
                <div className="p-8 pb-36 space-y-3">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Similar Songs You Might Like
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                    {recommendation.map((song, index) => {
                      // Construct the search query robustly
                      let searchQuery = song.song; // song.song is already cleaned
                      if (song.artist && typeof song.artist === 'string' && song.artist.trim() !== "") {
                        searchQuery += " " + song.artist; // song.artist is already cleaned
                      }

                      return (                        <div
                          className="bg-melody-purple-900/50 backdrop-blur-sm flex items-center p-4 rounded-xl border border-melody-purple-700/50 hover:border-melody-pink-600/50 hover:shadow-melody-pink-600/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                          key={index}
                          onClick={() => play(searchQuery, song.song, song.artist, song.movie || song.album || '')} // Use the constructed searchQuery and include album info
                        >
                          <div className="flex items-center justify-center h-12 w-12 bg-melody-purple-800 rounded-lg text-center mr-4 group-hover:bg-melody-pink-600 transition-colors duration-300 relative">
                            <span className="text-sm text-gray-300 font-medium group-hover:opacity-0 transition-opacity">{index + 1}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                          </div>
                          <div className="flex flex-col flex-grow gap-0.5">
                            <span className="text-md font-semibold text-white group-hover:text-melody-pink-400 transition-colors line-clamp-1">{song.song}</span>
                            <div className="flex items-center">
                              <span className="text-xs font-medium text-melody-pink-400/80">
                                {song.artist}
                              </span>
                              {song.movie && (
                                <>
                                  <span className="mx-1.5 text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-400 line-clamp-1">{song.movie}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="p-2 rounded-full bg-melody-pink-600/20 text-melody-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {midsection === "lyric" && (
                <div className="p-8 pb-40">
                  {/* Song info panel */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-grow lg:w-1/3 lg:max-w-md bg-melody-purple-900/40 backdrop-blur-sm border border-melody-purple-700/50 rounded-xl p-6 shadow-xl">
                      <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-3 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h1m-7 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Track Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs font-medium text-melody-pink-400">TITLE</span>
                          <div className="text-white font-medium mt-1">{he.decode(details.name)}</div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-melody-pink-400">ARTIST</span>
                          <div className="text-white font-medium mt-1">{details.primaryArtists || "Unknown Artist"}</div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-melody-pink-400">ALBUM</span>
                          <div className="text-white font-medium mt-1">{details.album ? he.decode(details.album.name) : "Single"}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-medium text-melody-pink-400">LANGUAGE</span>
                            <div className="text-white font-medium mt-1">{details.language || "Unknown"}</div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-melody-pink-400">YEAR</span>
                            <div className="text-white font-medium mt-1">{details.year || "Unknown"}</div>
                          </div>
                        </div>
                        {details.label && (
                          <div>
                            <span className="text-xs font-medium text-melody-pink-400">LABEL</span>
                            <div className="text-white font-medium mt-1">{details.label}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Lyrics panel */}
                    <div className="flex-grow lg:w-2/3 bg-melody-purple-900/40 backdrop-blur-sm border border-melody-purple-700/50 rounded-xl p-6 shadow-xl">
                      <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-3 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Lyrics
                      </h3>
                      <div className="relative">
                        <div className="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                          <div className="text-md whitespace-pre-line text-gray-200 leading-relaxed">
                            {lyrics ? lyrics : (
                              <div className="flex flex-col items-center py-10 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-400 text-lg">Lyrics not available for this song</span>
                                <p className="text-gray-500 text-sm mt-2">We couldn't find lyrics for this track.</p>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Fading effect at the bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-melody-purple-900/40 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Add extra bottom spacing for audio player */}
              <div className="h-36"></div>
            </div>
          ) : (
            // Mobile View
            <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-deep-grey/95 to-deep-blue/95 min-h-screen">
              {/* Mobile song header */}
              <div className="relative">
                <div className="absolute inset-0 bg-cover bg-center blur-sm opacity-20" style={{ backgroundImage: `url(${image})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-deep-blue/70 to-deep-blue"></div>
                <div className="relative pt-6 pb-4 px-4 flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="rounded-full absolute inset-0 bg-melody-pink-500 blur-xl opacity-20 scale-90"></div>
                    <div className="border-1 bg-melody-purple-900 border border-melody-pink-500/30 rounded-full w-48 h-48 flex items-center justify-center shadow-2xl overflow-hidden">
                      <img src={image} alt={songName} className="h-44 w-44 object-cover" />
                    </div>
                    <div className="absolute -bottom-2 right-2 bg-melody-pink-600 rounded-full p-2.5 shadow-lg border-2 border-deep-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1 text-center">{songName}</h1>
                  {details.primaryArtists && (
                    <p className="text-gray-300 text-sm mb-4 text-center">{details.primaryArtists}</p>
                  )}
                  
                  {/* Action buttons */}
                  <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-5">
                    {!dloading ? (
                      <>
                        {/* Like/Unlike button */}
                        <button 
                          onClick={liked ? handleDelete : handleLikes} 
                          className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl ${
                            liked ? 'bg-melody-pink-600/80' : 'bg-gray-800/60'
                          } backdrop-blur-sm transition-colors`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={liked ? "white" : "none"} viewBox="0 0 24 24" stroke="white" strokeWidth={liked ? 0 : 2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-xs text-white">{liked ? 'Liked' : 'Like'}</span>
                        </button>
                        
                        {/* Download button */}
                        <button
                          onClick={downloadAudio}
                          className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-gray-800/60 backdrop-blur-sm"
                          disabled={dloading}
                        >
                          {dloading ? (
                            <>
                              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-xs text-white">Loading</span>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              <span className="text-xs text-white">Download</span>
                            </>
                          )}
                        </button>
                        
                        {/* Save Offline button */}
                        <button
                          onClick={handleSaveOffline}
                          className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl ${
                            savedOffline ? 'bg-melody-purple-700/80' : 'bg-gray-800/60'
                          } backdrop-blur-sm transition-colors`}
                          disabled={savingOffline}
                        >
                          {savingOffline ? (
                            <>
                              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-xs text-white">Saving</span>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                {savedOffline && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />}
                              </svg>
                              <span className="text-xs text-white">{savedOffline ? 'Saved' : 'Save'}</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="col-span-3 flex items-center justify-center gap-2 text-white">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Make tabs sticky for mobile */}
              <div className="sticky top-0 z-10 px-4 py-2 bg-deep-blue/90 backdrop-blur-md">
                <div className="flex w-full bg-deep-grey/30 backdrop-blur-sm rounded-full overflow-hidden border border-gray-700/30 shadow-inner">
                  <button
                    className={`flex-1 py-2.5 px-4 font-medium text-sm transition-all duration-300 ${
                      midsection === "song"
                        ? "bg-melody-pink-500 text-white"
                        : "text-gray-300"
                    }`}
                    onClick={() => setMidsection("song")}
                  >
                    Recommendations
                  </button>
                  <button
                    className={`flex-1 py-2.5 px-4 font-medium text-sm transition-all duration-300 ${
                      midsection === "lyric"
                        ? "bg-melody-pink-500 text-white"
                        : "text-gray-300"
                    }`}
                    onClick={() => setMidsection("lyric")}
                  >
                    Lyrics & Info
                  </button>
                </div>
              </div>
              
              {midsection === "song" && (
                <div className="px-4 pb-40">
                  <h2 className="text-lg font-semibold text-white mb-3 flex items-center px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Similar Songs You Might Like
                  </h2>
                  <div className="space-y-3">
                    {recommendation.map((song, index) => (                      <div
                        className="bg-melody-purple-900/50 backdrop-blur-sm flex items-center p-3 rounded-xl border border-melody-purple-700/50 hover:border-melody-pink-600/50 hover:shadow-melody-pink-600/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        key={index}                        onClick={() => {
                          // Construct the search query robustly for mobile version too
                          let searchQuery = song.song; // song.song is already cleaned
                          if (song.artist && typeof song.artist === 'string' && song.artist.trim() !== "") {
                            searchQuery += " " + song.artist; // song.artist is already cleaned
                          }
                          play(searchQuery, song.song, song.artist, song.movie || song.album || '');
                        }}
                      >
                        <div className="flex items-center justify-center h-10 w-10 bg-melody-purple-800 rounded-lg text-center mr-4 group-hover:bg-melody-pink-600 transition-colors duration-300 relative">
                          <span className="text-xs text-gray-300 font-medium group-hover:opacity-0 transition-opacity">{index + 1}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                        </div>
                        <div className="flex flex-col flex-grow gap-0.5">
                          <span className="text-md font-semibold text-white group-hover:text-melody-pink-400 transition-colors line-clamp-1">{song.song}</span>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-melody-pink-400/80">
                              {song.artist}
                            </span>
                            {song.movie && (
                              <>
                                <span className="mx-1.5 text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-400 line-clamp-1">{song.movie}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-melody-pink-600/20 text-melody-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {midsection === "lyric" && (
                <div className="pb-40 px-4">
                  <div className="bg-melody-purple-900/50 backdrop-blur-sm border border-melody-purple-700/50 p-5 rounded-xl shadow-lg mb-4">
                    <h3 className="text-md font-semibold text-white border-b border-gray-700/50 pb-2 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-melody-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h1m-7 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Track Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-medium text-melody-pink-400">TITLE</span>
                        <div className="text-white text-sm font-medium mt-1">{he.decode(details.name)}</div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-melody-pink-400">YEAR</span>
                        <div className="text-white text-sm font-medium mt-1">{details.year || "Unknown"}</div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-melody-pink-400">ALBUM</span>
                        <div className="text-white text-sm font-medium mt-1">{details.album ? he.decode(details.album.name) : "Single"}</div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-melody-pink-400">LANGUAGE</span>
                        <div className="text-white text-sm font-medium mt-1">{details.language || "Unknown"}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-melody-purple-900/50 backdrop-blur-sm border border-melody-purple-700/50 p-5 rounded-xl shadow-lg">
                    <h3 className="text-md font-semibold text-white border-b border-gray-700/50 pb-2 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-melody-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Lyrics
                    </h3>
                    <div className="relative">
                      <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="text-sm whitespace-pre-line text-gray-200 leading-relaxed">
                          {lyrics ? lyrics : (
                            <div className="flex flex-col items-center py-6 text-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Lyrics not available for this song</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Fading effect at the bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-melody-purple-900/40 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Add extra bottom spacing for audio player */}
              <div className="h-40"></div>
            </div>
          )}
        </div>
      ) : (
        // Skeleton Loading View - Shown when loading is TRUE
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Skeleton structure */}
          {isAboveMedium ? (
            // Desktop Skeleton
            <div className="w-full max-w-6xl mx-auto mt-10 mb-20 bg-gradient-to-br from-deep-grey/90 to-deep-blue/95 rounded-3xl shadow-2xl p-0 overflow-hidden animate-pulse">
              <div className="h-60 bg-gray-700/50"></div> {/* Banner placeholder */}
              <div className="flex gap-1 border-b border-gray-700/50 px-8 mt-[-60px] relative z-10"> {/* Adjusted margin for overlap */}
                 {/* Song details overlay skeleton */}
                 <div className="w-full flex items-center gap-8 p-8 pt-0"> {/* Removed pt if banner is placeholder */}
                    <div className="h-48 w-48 rounded-2xl bg-gray-600/50"></div> {/* Image placeholder */}
                    <div className="flex-grow space-y-3">
                      <div className="h-8 bg-gray-600/50 rounded w-3/4"></div> {/* Song name placeholder */}
                      <div className="h-6 bg-gray-600/50 rounded w-1/2"></div> {/* Artist placeholder */}
                      <div className="h-4 bg-gray-600/50 rounded w-2/3"></div> {/* Album placeholder */}
                      <div className="flex gap-3 mt-2">
                        <div className="h-10 w-24 bg-gray-700/50 rounded-full"></div> {/* Button placeholder */}
                        <div className="h-10 w-24 bg-gray-700/50 rounded-full"></div> {/* Button placeholder */}
                        <div className="h-10 w-24 bg-gray-700/50 rounded-full"></div> {/* Button placeholder */}
                      </div>
                    </div>
                  </div>
              </div>
              <div className="flex gap-1 border-b border-gray-700/50 px-8">
                <div className="px-6 py-4 h-10 w-36 bg-gray-700/30 rounded-t-md"></div> {/* Tab placeholder */}
                <div className="px-6 py-4 h-10 w-36 bg-gray-700/30 rounded-t-md"></div> {/* Tab placeholder */}
              </div>
              <div className="p-8 space-y-3">
                <div className="h-6 bg-gray-600/50 rounded w-1/3 mb-4"></div> {/* Section title placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center p-4 rounded-xl bg-melody-purple-900/30 h-20">
                      <div className="h-12 w-12 bg-gray-700/50 rounded-lg mr-4"></div>
                      <div className="flex-grow space-y-2">
                        <div className="h-4 bg-gray-600/50 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-600/50 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Mobile Skeleton
            <div className="w-full p-4 animate-pulse">
              <div className="h-64 bg-gray-700/50 rounded-2xl mb-4"></div> {/* Image placeholder */}
              <div className="space-y-3 mb-6">
                <div className="h-8 bg-gray-600/50 rounded w-3/4 mx-auto"></div> {/* Song name placeholder */}
                <div className="h-6 bg-gray-600/50 rounded w-1/2 mx-auto"></div> {/* Artist placeholder */}
              </div>
              <div className="flex justify-around mb-6">
                <div className="h-12 w-12 bg-gray-700/50 rounded-full"></div> {/* Button placeholder */}
                <div className="h-12 w-12 bg-gray-700/50 rounded-full"></div> {/* Button placeholder */}
                <div className="h-12 w-12 bg-gray-700/50 rounded-full"></div> {/* Button placeholder */}
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-600/50 rounded w-1/3 mb-2"></div> {/* Section title placeholder */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center p-3 rounded-xl bg-melody-purple-900/30 h-16">
                    <div className="h-10 w-10 bg-gray-700/50 rounded-lg mr-3"></div>
                    <div className="flex-grow space-y-1">
                      <div className="h-4 bg-gray-600/50 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-600/50 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Innersongs;
