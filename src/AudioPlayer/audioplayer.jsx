import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Context } from "../context.js"; 
import useMediaQuery from "../useMedia";
import he from "he";
import { searchResult, searchSuggestion, newsearch } from "../saavnapi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { addRecents } from "../Firebase/database";
import './custom-audioplayer.css';
import { addSongToHistory, fetchRecommendations, navigateToNextSong, navigateToPrevSong } from "../utils/musicNavigation_fixed.js";
import RecommendationIndicator from "../components/RecommendationIndicator";
import { useOfflineDetection } from "../hooks/useOfflineDetection";
import { getOfflineSongUrl, isSongAvailableOffline } from "../utils/serviceWorkerUtils";

const HISTORY_TIMESTAMP_KEY = 'songHistoryLastUpdated';
const MAX_HISTORY_AGE_DAYS = 5;
const MAX_HISTORY_LENGTH = 50;

function AudioPlayerComponent() {
  const isAboveMedium = useMediaQuery("(min-width:1025px)"); 
  const { isOffline } = useOfflineDetection();
  const { 
    songid, 
    setSongid, 
    setSelected, 
    spotify, 
    setSpotify,
    songHistory,
    setSongHistory,
    currentHistoryIndex,
    setCurrentHistoryIndex,
    recommendations,
    setRecommendations,
    isLoadingRecommendations,
    setIsLoadingRecommendations
  } = useContext(Context);
  
  const [music, setMusic] = useState("");
  const [names, setNames] = useState("");
  const [array, setArray] = useState("");
  const [image, setImage] = useState("");  
  const [isFetching, setIsFetching] = useState(false);
  const [artists, setArtists] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const recommendationTimeoutRef = useRef(null);
  const [playingRecommendation, setPlayingRecommendation] = useState(false);
  const [recommendationType, setRecommendationType] = useState('api'); // 'api' or 'gemini'
  const [currentBlobUrl, setCurrentBlobUrl] = useState(null);

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (currentBlobUrl && currentBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [currentBlobUrl]);

  useEffect(() => {
    const lastUpdated = localStorage.getItem(HISTORY_TIMESTAMP_KEY);
    if (lastUpdated) {
        const lastUpdatedDate = new Date(parseInt(lastUpdated, 10));
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - MAX_HISTORY_AGE_DAYS);

        if (lastUpdatedDate < fiveDaysAgo) {
            setSongHistory([]);
            setCurrentHistoryIndex(-1);
            // Also clear the persisted songid so it doesn't reload into an empty history
            localStorage.removeItem("songid"); 
            setSongid(null); // Update context state
            localStorage.removeItem(HISTORY_TIMESTAMP_KEY);
            toast.info("Song history has been reset (older than 5 days).");
        }
    } else if (songHistory.length > 0) {
        // If history exists but no timestamp (e.g., first run after this update), stamp it.
        localStorage.setItem(HISTORY_TIMESTAMP_KEY, Date.now().toString());
    }
  }, [setSongHistory, setCurrentHistoryIndex, setSongid]); // Dependencies for context setters

  useEffect(() => {
    if ("mediaSession" in navigator && names) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: names,
        album: array,
        artist: artists,
        artwork: [
          { src: image, sizes: "96x96", type: "image/jpeg" },
          { src: image, sizes: "128x128", type: "image/jpeg" },
          { src: image, sizes: "192x192", type: "image/jpeg" },
          { src: image, sizes: "256x256", type: "image/jpeg" },
          { src: image, sizes: "384x384", type: "image/jpeg" },
          { src: image, sizes: "512x512", type: "image/jpeg" },
        ],
      });
    }
  }, [names, array, image, artists]);

  const fetchSongData = async () => {
    if (!songid) return;
    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 2;

    const attemptFetch = async () => {
      try {
        const res = await searchResult(songid);
        const songData = res.data.data[0];
        const decodedName = he.decode(songData.name);
        const artistName = songData.artists.primary[0].name;

        if (decodedName) setSpotify(artistName + " " + decodedName);
        setArtists(artistName);
        setArray(songData.album.name);
        setImage(songData.image[1].url);        setNames(decodedName);
        const url = songData.downloadUrl[4].url;
        
        // Check if we should use offline version
        let finalMusicUrl = url;
        try {
          // If offline or song is cached offline, try to get offline URL
          if (isOffline || isSongAvailableOffline(url)) {
            const offlineUrl = await getOfflineSongUrl(url);
            if (offlineUrl) {
              finalMusicUrl = offlineUrl;
              console.log('Using offline cached audio for:', decodedName);
            } else if (isOffline) {
              // If offline and no cached version, show error
              toast.error(`"${decodedName}" is not available offline. Please save it for offline playback when online.`);
              return false;
            }
          }
        } catch (offlineError) {
          console.warn('Error checking offline audio:', offlineError);
          if (isOffline) {
            toast.error(`"${decodedName}" is not available offline. Please save it for offline playback when online.`);
            return false;
          }        }
        
        // Clean up previous blob URL if exists
        if (currentBlobUrl && currentBlobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(currentBlobUrl);
        }
        
        setMusic(finalMusicUrl);
        setCurrentBlobUrl(finalMusicUrl);

        const songInfo = {
          id: songid,
          name: decodedName,
          artists: artistName,
          image: songData.image[1].url,
          album: songData.album.name,
          timestamp: new Date().toISOString(),
          songYear: songData.year
        };

        const songIsAlreadyAtCurrentIndexInHistory = 
          songHistory[currentHistoryIndex] && songHistory[currentHistoryIndex].id === songid;

        if (songIsAlreadyAtCurrentIndexInHistory) {
          // This is a history navigation or re-fetch of current song.
          // No need to manipulate songHistory array itself.
          // But we should update the timestamp if it's a re-fetch that might imply activity.
          // However, primary timestamp update is on actual history change.
        } else {
          let updatedHistory = [...songHistory];
          let insertionPointIndex = currentHistoryIndex; 

          const existingSongHistIndex = updatedHistory.findIndex(s => s.id === songInfo.id);

          if (existingSongHistIndex !== -1) {
            updatedHistory.splice(existingSongHistIndex, 1);
            if (existingSongHistIndex <= insertionPointIndex) {
              insertionPointIndex--; 
            }
          }

          updatedHistory.splice(insertionPointIndex + 1, updatedHistory.length - (insertionPointIndex + 1), songInfo);
          let newIndexForThisSong = insertionPointIndex + 1;

          if (updatedHistory.length > MAX_HISTORY_LENGTH) {
            const numToRemove = updatedHistory.length - MAX_HISTORY_LENGTH;
            updatedHistory.splice(0, numToRemove); 
            newIndexForThisSong -= numToRemove;
            if (newIndexForThisSong < 0) newIndexForThisSong = 0; // Should not happen if MAX_HISTORY_LENGTH > 0
          }
          
          setSongHistory(updatedHistory);
          setCurrentHistoryIndex(newIndexForThisSong); 
          localStorage.setItem(HISTORY_TIMESTAMP_KEY, Date.now().toString());
        }
        
        const user = JSON.parse(localStorage.getItem("Users"));
        if (user && songInfo.id && songInfo.name && songInfo.image) {
          addRecents(user.uid, songInfo.id, songInfo.name, songInfo.image).catch(err => console.error("Error adding recents:", err));
        }
        prefetchRecommendations(songInfo);
        return true;

      } catch (error) {
        console.error(`Error fetching song data (attempt ${retryCount + 1}/${maxRetries}):`, error);
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          return attemptFetch();
        }
        toast.error("Failed to load song. Please try another one.");
        return false;
      }
    };
    try {
      await attemptFetch();
    } finally {
      setIsLoading(false);
    }
  };

  const prefetchRecommendations = async (songInfo, forceNewRecommendations = false) => {
    if (recommendationTimeoutRef.current) clearTimeout(recommendationTimeoutRef.current);
    if (!songInfo || !songInfo.id) {
      console.error('Invalid song info for prefetching recommendations:', songInfo);
      return;
    }
    const songName = songInfo.name || '';
    const artistName = songInfo.artists || '';
    if (currentHistoryIndex >= songHistory.length - 3 || forceNewRecommendations) {
      setIsLoadingRecommendations(true);
      try {
        const { recommendations: recs, source } = await fetchRecommendations(
          songInfo.id, songName, artistName, songHistory, forceNewRecommendations
        );
        setRecommendations(recs);
        if (source === 'gemini' && recs.length > 0) {
          recommendationTimeoutRef.current = setTimeout(async () => {
            try {              const firstRec = recs[0];              const songName = firstRec.name || firstRec.song;
              const artistName = firstRec.artists || firstRec.artist;
              const albumName = firstRec.movie || firstRec.album || '';
              console.log('Recommendation object:', firstRec);
              console.log('Extracted songName:', songName, 'artistName:', artistName, 'albumName:', albumName);
              if (!songName || !artistName) {
                console.warn('Missing song info for recommendation search:', firstRec);
                return;
              }
              const searchQuery = `${songName} ${artistName}`.trim();
              if (searchQuery.length < 3) {
                console.error('Search query too short:', searchQuery);
                return;
              }
              const songId = await newsearch(searchQuery, songName, artistName, albumName);
              if (songId) {
                const updatedRecs = [...recs];
                updatedRecs[0].id = songId;
                setRecommendations(updatedRecs);
              } else {
                console.warn('No song ID found for:', searchQuery);
                if (recs.length > 1) {                  const nextRec = recs[1];
                  const nextSongName = nextRec.name || nextRec.song;
                  const nextArtistName = nextRec.artists || nextRec.artist;
                  const nextAlbumName = nextRec.movie || nextRec.album || '';
                  if (nextSongName && nextArtistName) {
                    const nextQuery = `${nextSongName} ${nextArtistName}`.trim();
                    const nextSongId = await newsearch(nextQuery, nextSongName, nextArtistName, nextAlbumName);
                    if (nextSongId) {
                      const newRecs = [...recs];
                      newRecs[0] = { ...nextRec, id: nextSongId };
                      newRecs.splice(1, 1);
                      setRecommendations(newRecs);
                    }
                  }
                }
              }
            } catch (error) {
              console.error("Error searching for recommendation:", error);
            }
          }, 2000);
        }
      } catch (error) {
        console.error("Error prefetching recommendations:", error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    }
  };

  useEffect(() => {
    if (songid) fetchSongData();
  }, [songid]);

  useEffect(() => {
    return () => {
      if (recommendationTimeoutRef.current) clearTimeout(recommendationTimeoutRef.current);
    };
  }, []);

  const handleNext = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const result = await navigateToNextSong({
        currentIndex: currentHistoryIndex,
        songHistory,
        recommendations,
        isLoadingRecommendations,
        currentSongId: songid,
        currentSongName: names, 
        artistName: artists,   
        setSongId: setSongid, // Though setSongid is called later, navigateToNextSong might use it for internal logic
        setLoadingRecommendations: setIsLoadingRecommendations 
      });

      if (result.songId !== songid) {
        localStorage.setItem("songid", result.songId);
        setCurrentHistoryIndex(result.newIndex); // Update index BEFORE setSongid

        if (result.addToHistory && result.song) { // Song is a recommendation
          setPlayingRecommendation(true);
          setRecommendationType(result.song.type || 'api');
          
          const playedRec = result.song;
          setRecommendations(prevRecs => {
            const newRecs = prevRecs.filter(r => {
              if (r.id && playedRec.id) return r.id !== playedRec.id;
              if (r.name && playedRec.name && r.artists && playedRec.artists) {
                return !(r.name.toLowerCase() === playedRec.name.toLowerCase() && 
                         r.artists.toLowerCase() === playedRec.artists.toLowerCase());
              }
              return true; 
            });

            if (newRecs.length === 0 && playedRec.id) { 
              prefetchRecommendations(playedRec, true); 
            }
            return newRecs;
          });
        } else { // Song is from history
          setPlayingRecommendation(false);
        }
        setSongid(result.songId); // Triggers fetchSongData
      } else { // Song ID is the same (e.g., repeat current, or end of playlist with no repeat)
        setCurrentHistoryIndex(result.newIndex); 
        if (result.addToHistory && result.song) { 
            setPlayingRecommendation(true);
            setRecommendationType(result.song.type || 'api');
        } else {
            setPlayingRecommendation(false);
        }
      }
    } catch (error) {
      console.error("Error handling next song:", error);
      toast.error("Could not play next song. Please try again.");
    } finally {
      setIsFetching(false);
    }
  }, [
    isFetching, 
    songid, 
    names, 
    artists, 
    songHistory, 
    currentHistoryIndex, 
    recommendations, 
    isLoadingRecommendations, 
    setSongid,
    setRecommendations, 
    // setSongHistory, // setSongHistory is called by fetchSongData, not directly here
    setCurrentHistoryIndex,
    setIsLoadingRecommendations,
    setPlayingRecommendation,
    setRecommendationType,
    prefetchRecommendations // Added prefetchRecommendations
  ]);

  const handlePrev = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const result = navigateToPrevSong({ 
        currentIndex: currentHistoryIndex, 
        songHistory
      });

      if (result.songId && result.songId !== songid) {
        localStorage.setItem("songid", result.songId);
        setCurrentHistoryIndex(result.newIndex); // Update index BEFORE setSongid
        setSongid(result.songId); 
        setPlayingRecommendation(false); 
      } else if (result.songId && result.songId === songid) {
        // Navigated to the same song (e.g., at beginning of history and tried to go prev)
        setCurrentHistoryIndex(result.newIndex); 
      } else if (!result.songId && songHistory.length > 0) { 
        toast.info("You're at the beginning of your listening history");
        if (currentHistoryIndex !== 0) setCurrentHistoryIndex(0);
      }
    } catch (error) {
      console.error("Error handling previous song:", error);
      toast.error("Could not play previous song. Please try again.");
    } finally {
      setIsFetching(false);
    }
  }, [
    isFetching, 
    songid, 
    songHistory, 
    currentHistoryIndex, 
    setSongid, 
    setCurrentHistoryIndex, 
    setPlayingRecommendation
  ]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("nexttrack", handleNext);
      navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
    }
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
      }
    };
  }, [handleNext, handlePrev]);

  useEffect(() => {
    const initializeHistory = async () => {
      if (songid && songHistory.length === 0) {
        await fetchSongData();
      }
    };
    initializeHistory();
  }, [songid, songHistory.length]);

  useEffect(() => {
    if (
      currentHistoryIndex === songHistory.length - 1 &&
      songHistory.length > 0 &&
      recommendations.length === 0 &&
      !isLoadingRecommendations
    ) {
      const currentSong = songHistory[currentHistoryIndex];
      const hasRecentlyUsedRecs = songHistory.some((song, idx) =>
        idx < currentHistoryIndex &&
        song.id === currentSong?.id &&
        Date.now() - new Date(song.timestamp).getTime() < 1000 * 60 * 10
      );
      if (currentSong && currentSong.id) {
        prefetchRecommendations(currentSong, hasRecentlyUsedRecs);
      }
    }
  }, [currentHistoryIndex, songHistory, recommendations.length, isLoadingRecommendations]);

  const setdisplay = () => {
    localStorage.setItem("selected", "innersong");
    setSelected("innersong");
  };

  const LoadingState = () => (
    <div className="flex animate-pulse items-center gap-4 p-4 w-full">
      <div className="rounded-lg bg-deep-grey h-14 w-14"></div>
      <div className="flex-1">
        <div className="h-4 bg-deep-grey rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-deep-grey rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div>      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="dark"
        transition={Bounce}
        limit={3}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      />
      <RecommendationIndicator 
        visible={playingRecommendation || isLoadingRecommendations}
        loading={isLoadingRecommendations}
        recommendationType={recommendationType}
      />
      {isAboveMedium ? (        <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-deep-blue/90 border-t border-gray-700 shadow-lg z-50 animate-slideUp">
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 max-w-7xl mx-auto">
              <div
                className="flex items-center gap-3 min-w-[200px] hover:cursor-pointer group"
                onClick={setdisplay}
              >
                <Link to="innersong" className="block">
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={image} 
                      alt={names}
                      className="h-14 w-14 object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </Link>                <div className="flex flex-col">
                  <h1 className="text-sm font-semibold truncate max-w-[140px]">{names}</h1>
                  <p className="text-xs text-gray-400 truncate max-w-[140px]">{artists}</p>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    {songHistory.length > 0 && (
                      <span>{currentHistoryIndex + 1} of {songHistory.length}</span>
                    )}
                    {music && music.startsWith('blob:') && (
                      <span className="text-melody-pink-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className={`nav-indicator ${isLoadingRecommendations ? 'visible' : ''}`}>
                  Loading recommendations
                  <span className="nav-loading"></span>
                </div>
                <div className={`recommendation-ready ${recommendations.length > 0 ? 'visible' : ''}`} 
                     style={{ top: '10px', right: '30%' }}></div>                <AudioPlayer
                  showSkipControls
                  onClickNext={handleNext}
                  onClickPrevious={handlePrev}
                  onEnded={handleNext}
                  onError={(e) => {
                    console.error("Audio playback error:", e);
                    if (isOffline) {
                      toast.error("Cannot play song in offline mode. Please check if the song is saved for offline playback.");
                    } else {
                      toast.error("Unable to play this song. Skipping to next...");
                      setTimeout(handleNext, 1500);
                    }
                  }}
                  onLoadStart={() => {
                    if (isOffline && music && music.startsWith('blob:')) {
                      console.log('Loading offline audio:', names);
                    }
                  }}
                  src={music}
                  autoPlay={true}
                  className="bg-transparent"
                  showJumpControls={true}
                  showFilledVolume={false}
                  layout="stacked-reverse"
                  customProgressBarSection={[
                    "CURRENT_TIME",
                    "PROGRESS_BAR",
                    "DURATION",
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      ) : (        <div className="fixed bottom-16 inset-x-0 backdrop-blur-md bg-deep-blue/90 border-t border-gray-700 shadow-lg z-50 animate-slideUp">
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="p-1">
              <div className="flex items-center justify-between mb-1 px-2">
                <Link to="innersong" className="flex items-center gap-2" onClick={setdisplay}>
                  <img src={image} alt={names} className="h-8 w-8 rounded-md" />                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs font-bold truncate max-w-[140px]">{names}</h2>
                    <p className="text-xs text-gray-400 truncate max-w-[140px]">{artists}</p>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      {songHistory.length > 0 && (
                        <span>{currentHistoryIndex + 1}/{songHistory.length}</span>
                      )}
                      {music && music.startsWith('blob:') && (
                        <span className="text-melody-pink-400 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          </svg>
                          Offline
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
              <div className="relative">
                <div className={`nav-indicator ${isLoadingRecommendations ? 'visible' : ''}`}>
                  Loading
                  <span className="nav-loading"></span>
                </div>
                <div className={`recommendation-ready ${recommendations.length > 0 ? 'visible' : ''}`}></div>                <AudioPlayer
                  src={music}
                  showSkipControls
                  onClickNext={handleNext}
                  onClickPrevious={handlePrev}
                  onEnded={handleNext}
                  onError={(e) => {
                    console.error("Audio playback error:", e);
                    if (isOffline) {
                      toast.error("Cannot play song in offline mode. Please check if the song is saved for offline playback.");
                    } else {
                      toast.error("Unable to play this song. Skipping to next...");
                      setTimeout(handleNext, 1500);
                    }
                  }}
                  onLoadStart={() => {
                    if (isOffline && music && music.startsWith('blob:')) {
                      console.log('Loading offline audio:', names);
                    }
                  }}
                  autoPlay={true}
                  showJumpControls={true}
                  showFilledVolume={false}
                  layout="horizontal-reverse"
                  customControlsSection={["MAIN_CONTROLS"]}
                  customProgressBarSection={[
                    "PROGRESS_BAR"
                  ]}
                  className="bg-transparent"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AudioPlayerComponent;