import { searchSuggestion } from "../saavnapi";
import { getSongRecommendations } from "../gemini.js";

/**
 * Adds a song to history
 * @param {Object} song - The song to add to history
 * @param {Array} currentHistory - The current song history
 * @param {Number} currentIndex - The current position in history
 * @returns {Object} - New history and index
 */
export const addSongToHistory = (song, currentHistory, currentIndex) => {
  // Validate input
  if (!song || !song.id) {
    console.error("Invalid song provided to history:", song);
    return { newHistory: currentHistory || [], newIndex: currentIndex || 0 };
  }
  
  // Ensure currentHistory is an array
  const history = Array.isArray(currentHistory) ? currentHistory : [];
  
  // Check if this song already exists in history
  const existingIndex = history.findIndex(item => item && item.id === song.id);
  
  // Simple approach: just add to the end if new, or use existing index if already exists
  if (existingIndex !== -1) {
    // Song already exists, just point to it
    return { 
      newHistory: history, 
      newIndex: existingIndex 
    };
  } else {
    // Add the new song to the end
    const newHistory = [...history, song];
    
    // Limit history to 20 items
    const finalHistory = newHistory.length > 20 ? 
      newHistory.slice(newHistory.length - 20) : newHistory;
    
    return { 
      newHistory: finalHistory, 
      newIndex: finalHistory.length - 1 
    };
  }
};

// Store songs that have been rejected or couldn't be found
// This helps prevent the same Gemini recommendations from being suggested again
const rejectedSongs = new Set();

/**
 * Fetches recommendations using both API methods with fallback
 * @param {String} songId - The ID of the song to get recommendations for
 * @param {String} songName - The name of the song
 * @param {String} artistName - The artist name
 * @param {Array} history - The song history to avoid duplicates
 * @param {Boolean} forceNewRecommendations - Force new recommendations when all current ones have been used
 * @param {Set} previouslyRecommended - Optional set of already recommended song names to avoid duplicates
 * @returns {Array} - Array of recommended songs
 */
export const fetchRecommendations = async (
  songId, 
  songName, 
  artistName, 
  history, 
  forceNewRecommendations = false,
  previouslyRecommended = new Set()
) => {
  const MAX_RETRIES = 2;
  let retriesLeft = MAX_RETRIES;
  let delay = 1000; // Start with a 1 second delay
  
  // Try with API first (faster and has direct IDs)
  while (retriesLeft > 0) {
    try {
      const res = await searchSuggestion(songId);
      if (res && res.data && res.data.length > 0) {
        // Filter out any songs that are already in history
        const filteredRecs = res.data.filter(song => {
          // Skip if song ID is in history
          if (history.some(histSong => histSong.id === song.id)) {
            return false;
          }
          
          // Skip if song name+artist is in previously recommended set
          const songKey = `${song.name}:${song.artists.primary[0].name}`.toLowerCase();
          if (previouslyRecommended.has(songKey)) {
            return false;
          }
          
          return true;
        });
        
        if (filteredRecs.length > 0) {
          return {
            recommendations: filteredRecs.map(song => ({
              id: song.id,
              name: song.name,
              image: song.image[1].url,
              artists: song.artists.primary[0].name,
              type: 'api'
            })),
            source: 'api'
          };
        }
      }
      // If we get here, API provided no usable recommendations
      break;
    } catch (error) {
      console.error(`Error fetching API recommendations (try ${MAX_RETRIES - retriesLeft + 1}):`, error);
      retriesLeft--;
      
      if (retriesLeft > 0) {
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Double the delay for next retry
      }
    }
  }
  
  // Fallback to Gemini AI recommendations
  try {
    if (songName && artistName && songName !== 'undefined' && artistName !== 'undefined') {
      console.log('Fetching Gemini recommendations for:', songName, artistName);
      
      // If force new recommendations is enabled, modify the query slightly to get different results
      let modifiedArtistName = artistName;
      if (forceNewRecommendations) {
        // Add a hint to get different recommendations
        modifiedArtistName = `${artistName} (different style)`;
      }
      
      const geminiRecs = await getSongRecommendations(songName, modifiedArtistName);
      if (geminiRecs && geminiRecs.length > 0) {
        // Enhanced filtering: check against history, previously recommended, and rejected songs
        const filteredRecs = geminiRecs.filter(rec => {
          if (!rec.song || !rec.artist) return false;
          
          // Create a unique key for this song recommendation
          const recKey = `${rec.song}:${rec.artist}`.toLowerCase();
          
          // Check if this song-artist combo is in history
          const inHistory = history.some(histSong => {
            if (!histSong.name || !histSong.artists) return false;
            const histKey = `${histSong.name}:${histSong.artists}`.toLowerCase();
            return histKey === recKey;
          });
          
          // Skip if in history, previously recommended, or in rejected list
          return !inHistory && 
                 !previouslyRecommended.has(recKey) && 
                 !rejectedSongs.has(recKey);
        });
        
        if (filteredRecs.length > 0) {
          return {
            recommendations: filteredRecs.map(rec => ({
              name: rec.song,
              artists: rec.artist,
              movie: rec.movie || '',
              type: 'gemini'
            })),
            source: 'gemini'
          };
        }
      }
    } else {
      console.warn('Missing song info for Gemini recommendations:', { songName, artistName });
    }
  } catch (error) {
    console.error("Error fetching Gemini recommendations:", error);
  }
  
  return { recommendations: [], source: 'none' };
};

/**
 * Marks a Gemini recommendation as rejected so it won't be recommended again
 * @param {Object} song - The song to mark as rejected
 */
export const rejectRecommendation = (song) => {
  if (song && song.name && song.artists) {
    const recKey = `${song.name}:${song.artists}`.toLowerCase();
    rejectedSongs.add(recKey);
  }
};

/**
 * Handles navigation to the next song
 * @param {Object} params - Navigation parameters
 * @param {Set} previouslyRecommended - Set of already recommended song keys
 * @returns {Object} - New song info
 */
export const navigateToNextSong = async ({ 
  currentIndex, 
  songHistory, 
  recommendations, 
  isLoadingRecommendations,
  currentSongId,
  currentSongName,
  artistName,
  setSongId,
  setLoadingRecommendations,
  previouslyRecommended = new Set()
}) => {
  // Validate inputs
  if (!Array.isArray(songHistory)) {
    console.error("Invalid song history:", songHistory);
    return {
      songId: currentSongId || '',
      newIndex: 0,
      addToHistory: false,
      song: { id: currentSongId, name: currentSongName, artists: artistName }
    };
  }
  
  // First, check if we can navigate forward in history
  if (currentIndex < songHistory.length - 1) {
    const nextSong = songHistory[currentIndex + 1];
    if (nextSong && nextSong.id) {
      return {
        songId: nextSong.id,
        newIndex: currentIndex + 1,
        addToHistory: false,
        song: nextSong
      };
    }
  }
  
  // If we've reached the end of history, use recommendations
  if (recommendations.length > 0) {
    const nextRec = recommendations[0];
    
    // If it's an API recommendation with an ID, we can use it directly
    if (nextRec.id) {
      // Add this to previously recommended set to avoid duplicates
      if (nextRec.name && nextRec.artists) {
        const recKey = `${nextRec.name}:${nextRec.artists}`.toLowerCase();
        previouslyRecommended.add(recKey);
      }
      
      return {
        songId: nextRec.id,
        newIndex: currentIndex, // Don't change index until song is loaded
        addToHistory: true,
        song: nextRec
      };
    }
    // If we have a Gemini recommendation without an ID, wait for ID to be fetched
    else if (nextRec.type === 'gemini') {
      return {
        songId: currentSongId,
        newIndex: currentIndex,
        addToHistory: false,
        song: songHistory[currentIndex]
      };
    }
  }
  
  // If no recommendations are available, try to fetch some
  if (recommendations.length === 0 && !isLoadingRecommendations) {
    setLoadingRecommendations(true);
    try {
      // Get current song info from history if names are undefined
      let songName = currentSongName;
      let artist = artistName;
      
      if (!songName || !artist) {
        const currentSong = songHistory[currentIndex];
        songName = currentSong?.name || '';
        artist = currentSong?.artists || '';
      }
      
      const { recommendations: recs } = await fetchRecommendations(
        currentSongId,
        songName,
        artist,
        songHistory,
        false, // Don't force new recommendations on first attempt
        previouslyRecommended
      );
      
      // If we got recommendations, use the first one immediately
      if (recs && recs.length > 0) {
        const firstRec = recs[0];
        // If this is an API recommendation (has direct ID)
        if (firstRec.id) {
          // Add to previously recommended set
          if (firstRec.name && firstRec.artists) {
            const recKey = `${firstRec.name}:${firstRec.artists}`.toLowerCase();
            previouslyRecommended.add(recKey);
          }
          
          return {
            songId: firstRec.id,
            newIndex: currentIndex,
            addToHistory: true,
            song: firstRec
          };
        }
      }
    } catch (error) {
      console.error("Error fetching immediate recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  }
  
  // If we couldn't get anything new, stay on current song
  return {
    songId: currentSongId,
    newIndex: currentIndex,
    addToHistory: false,
    song: songHistory[currentIndex]
  };
};

/**
 * Handles navigation to the previous song
 * @param {Object} params - Navigation parameters
 * @returns {Object} - New song info
 */
export const navigateToPrevSong = ({ currentIndex, songHistory }) => {
  // Validate inputs
  if (!Array.isArray(songHistory) || songHistory.length === 0) {
    console.error("Invalid or empty song history:", songHistory);
    return {
      songId: '',
      newIndex: 0,
      song: null
    };
  }
  
  // If we have a previous song in history, use it
  if (currentIndex > 0) {
    const prevSong = songHistory[currentIndex - 1];
    if (prevSong && prevSong.id) {
      return {
        songId: prevSong.id,
        newIndex: currentIndex - 1,
        song: prevSong
      };
    }
  }
  
  // If we're at the beginning, just stay at the first song
  const firstSong = songHistory[0];
  return {
    songId: firstSong?.id || '',
    newIndex: 0,
    song: firstSong || null
  };
};