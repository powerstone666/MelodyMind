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
import { addSongToHistory, fetchRecommendations, navigateToNextSong, navigateToPrevSong } from "../utils/musicNavigation";
import RecommendationIndicator from "../components/RecommendationIndicator";

function AudioPlayerComponent() {
  const isAboveMedium = useMediaQuery("(min-width:1025px)"); 
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

  // Check if the browser supports the Media Session API
  useEffect(() => {
    if ("mediaSession" in navigator && names) {
      navigator.mediaSession.metadata = new MediaMetadata({
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
    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 2;
    
    const attemptFetch = async () => {
      try {
        const res = await searchResult(songid);
        const song = res.data.data[0];
        const decodedName = he.decode(song.name);
        const artistName = song.artists.primary[0].name;
        
        if (decodedName) {
          setSpotify(artistName + " " + decodedName);
        }
        
        setArtists(artistName);
        setArray(song.album.name);
        setImage(song.image[1].url);
        setNames(decodedName);
        const url = song.downloadUrl[4].url;
        setMusic(url);
        
        // Add song to history if it's a new song
        const songInfo = {
          id: songid,
          name: decodedName,
          artists: artistName,
          image: song.image[1].url,
          album: song.album.name,
          timestamp: new Date().toISOString(),
          songYear: song.year
        };
        
        // Add to history - simplified approach
        const { newHistory, newIndex } = addSongToHistory(songInfo, songHistory, currentHistoryIndex);
        setSongHistory(newHistory);
        setCurrentHistoryIndex(newIndex);
        
        // Reset recommendation indicator when loading a new song directly
        setPlayingRecommendation(false);
        
        // Prefetch recommendations for this song
        prefetchRecommendations(songInfo);
        
        return true; // Success
      } catch (error) {
        console.error(`Error fetching song data (attempt ${retryCount + 1}/${maxRetries}):`, error);
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Increasing backoff
          return attemptFetch(); // Retry
        }
        
        toast.error("Failed to load song. Please try another one.");
        return false; // Failed after retries
      }
    };
    
    try {
      await attemptFetch();
    } finally {
      setIsLoading(false);
    }
  };

  // Prefetch recommendations for smooth navigation experience
  const prefetchRecommendations = async (songInfo, forceNewRecommendations = false) => {
    // Clear any existing recommendation timeout
    if (recommendationTimeoutRef.current) {
      clearTimeout(recommendationTimeoutRef.current);
    }
      
    // Ensure we have valid data
    if (!songInfo || !songInfo.id) {
      console.error('Invalid song info for prefetching recommendations:', songInfo);
      return;
    }
    
    // Ensure we have valid song name and artist
    const songName = songInfo.name || '';
    const artistName = songInfo.artists || '';
    
    // If we're close to the end of our history, proactively load recommendations
    if (currentHistoryIndex >= songHistory.length - 3 || forceNewRecommendations) {
      setIsLoadingRecommendations(true);
      
      try {
        const { recommendations: recs, source } = await fetchRecommendations(
          songInfo.id, 
          songName, 
          artistName, 
          songHistory,
          forceNewRecommendations
        );
        
        setRecommendations(recs);
        
        // If recommendations are from Gemini, we'll need to search for them          
        if (source === 'gemini' && recs.length > 0) {
          // Schedule async search for the first recommendation to get actual song ID
          recommendationTimeoutRef.current = setTimeout(async () => {
            try {
              const firstRec = recs[0];
              
              // Ensure we have valid song and artist names - check both name/artists and song/artist fields
              const songName = firstRec.name || firstRec.song;
              const artistName = firstRec.artists || firstRec.artist;
              
              if (!songName || !artistName) {
                console.warn('Missing song info for recommendation search:', firstRec);
                return;
              }
              
              const searchQuery = `${songName} ${artistName}`.trim();
              
              if (searchQuery.length < 3) {
                console.error('Search query too short:', searchQuery);
                return;
              }
              
              const songId = await newsearch(searchQuery);
              
              if (songId) {
                // Update the recommendation with the actual song ID
                const updatedRecs = [...recs];
                updatedRecs[0].id = songId;
                setRecommendations(updatedRecs);
              } else {
                console.warn('No song ID found for:', searchQuery);
                // If we couldn't find the song ID for the first recommendation,
                // try with the next one if available
                if (recs.length > 1) {
                  const nextRec = recs[1];
                  // Check for both naming conventions
                  const nextSongName = nextRec.name || nextRec.song;
                  const nextArtistName = nextRec.artists || nextRec.artist;
                  
                  if (nextSongName && nextArtistName) {
                    const nextQuery = `${nextSongName} ${nextArtistName}`.trim();
                    
                    const nextSongId = await newsearch(nextQuery);
                    if (nextSongId) {
                      // Move the successful recommendation to the front
                      const newRecs = [...recs];
                      newRecs[0] = { ...nextRec, id: nextSongId };
                      newRecs.splice(1, 1); // Remove the second item that we just processed
                      setRecommendations(newRecs);
                    }
                  }
                }
              }
            } catch (error) {
              console.error("Error searching for recommendation:", error);
            }
          }, 2000); // Delay to prevent API rate limiting
        }
      } catch (error) {
        console.error("Error prefetching recommendations:", error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    }
  };

  useEffect(() => {
    if (songid) {
      fetchSongData();
    }
  }, [songid]);

  // Clear the recommendation timeout when component unmounts
  useEffect(() => {
    return () => {
      if (recommendationTimeoutRef.current) {
        clearTimeout(recommendationTimeoutRef.current);
      }
    };
  }, []);

  const handleNext = useCallback(async () => {
    if (isFetching) return; // Prevent multiple calls
    setIsFetching(true);

    try {
      // Ensure we have valid song info
      const currentSongName = names || '';
      const currentArtist = artists || '';
      
      // Check if we have a song in history to navigate to
      const result = await navigateToNextSong({
        currentIndex: currentHistoryIndex,
        songHistory: songHistory,
        recommendations,
        isLoadingRecommendations,
        currentSongId: songid,
        currentSongName,
        artistName: currentArtist,
        setSongId: setSongid,
        setLoadingRecommendations: setIsLoadingRecommendations
      });

      // Check if we're about to play a different song
      if (result.songId !== songid) {
        localStorage.setItem("songid", result.songId);
        setSongid(result.songId);
        
        // SIMPLE APPROACH: Handle differently based on whether we're adding to history
        if (result.addToHistory && result.song) {
          // This is a new song (recommendation) that needs to be added to history
          setPlayingRecommendation(true);
          setRecommendationType(result.song.type || 'api');
          
          // Add to history
          const { newHistory, newIndex } = addSongToHistory(
            result.song,
            songHistory,
            currentHistoryIndex
          );
          
          setSongHistory(newHistory);
          setCurrentHistoryIndex(newIndex);
          
          // Remove the used recommendation from the list
          if (recommendations.length > 1) {
            setRecommendations(prev => prev.slice(1));
          } else {
            setRecommendations([]);
            const currentSong = songHistory[currentHistoryIndex];
            if (currentSong && currentSong.id) {
              // Force new recommendations
              prefetchRecommendations(currentSong, true);
              toast.info("Loading fresh recommendations...");
            }
          }
        } else {
          // This is navigation through existing history
          setPlayingRecommendation(false);
          setCurrentHistoryIndex(result.newIndex);
        }

        // Add to Firebase recents if user is logged in
        const user = JSON.parse(localStorage.getItem("Users"));
        if (user && result.song) {
          await addRecents(
            user.uid, 
            result.songId, 
            result.song.name || result.song.songName || he.decode(result.song.name), 
            result.song.image
          );
        }
      } else {
        // If we couldn't navigate to a new song, show a message and try to load recommendations
        if (recommendations.length === 0 && !isLoadingRecommendations) {
          toast.info("Loading recommendations...");
          
          // Trigger recommendation loading
          const currentSong = songHistory[currentHistoryIndex];
          if (currentSong) {
            prefetchRecommendations(currentSong);
          }
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
    setSongid
  ]);

  const handlePrev = useCallback(async () => {
    if (isFetching) return; // Prevent multiple calls
    setIsFetching(true);

    try {
      const result = navigateToPrevSong({
        currentIndex: currentHistoryIndex,
        songHistory: songHistory
      });

      if (result.songId && result.songId !== songid) {
        localStorage.setItem("songid", result.songId);
        setSongid(result.songId);
        
        // SIMPLE APPROACH: Just update the index pointer
        // No manipulation of history structure
        setCurrentHistoryIndex(result.newIndex);
        
        // Reset recommendation indicator when going back
        setPlayingRecommendation(false);
        
        // Add this song lookup to Firebase if logged in
        const user = JSON.parse(localStorage.getItem("Users"));
        if (user && result.song) {
          await addRecents(
            user.uid, 
            result.songId, 
            result.song.name || result.song.songName || he.decode(result.song.name), 
            result.song.image
          );
        }
      } else if (!result.songId) {
        toast.info("You're at the beginning of your listening history");
      }
    } catch (error) {
      console.error("Error handling previous song:", error);
      toast.error("Could not play previous song. Please try again.");
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, songid, songHistory, currentHistoryIndex, setSongid]);

  useEffect(() => {
    // Set up Media Session API handlers
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

  // Initialize song history if it's empty and we have a song playing
  useEffect(() => {
    const initializeHistory = async () => {
      if (songid && songHistory.length === 0) {
        await fetchSongData();
      }
    };
    
    initializeHistory();
  }, [songid, songHistory.length]);

  // Keep the rest of your component code here...

  return (
    <div>
      {/* Keep the rest of your JSX code here */}
    </div>
  );
}

export default AudioPlayerComponent;
