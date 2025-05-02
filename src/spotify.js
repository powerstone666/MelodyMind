import axios from 'axios';
/*
export const getRecommendations = async (songName) => {
    try {
     
      
      const res=await axios.get("http://localhost:3000/api/v1/musicsuggestion");
      console.log(res.data);
      return "error"
    } catch (error) {
        console.error('Error in getRecommendations:', error);
        return "error";
    }
};

*/

const API_KEY =import.meta.env.VITE_LAST_FM;

const searchSong = async (songName) => {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${songName}&api_key=${API_KEY}&format=json`;

    try {
        const response = await axios.get(url);
     
        const searchResults = response.data.results.trackmatches.track;

        if (searchResults.length > 0) {
            // Assuming the first result is the most relevant
            const artist = searchResults[1].artist;
            const track = searchResults[1].name;
            return { artist, track };
        } else {
            throw new Error('No results found for the song');
        }
    } catch (error) {
       return "error"
    }
};

const getSimilarSongs = async (artist, track, limit = 20) => {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${track}&api_key=${API_KEY}&limit=${limit}&format=json`;

    try {
        const response = await axios.get(url);
        console.log(response.data);
        const similarTracks = response.data.similartracks.track;

        return similarTracks;
    } catch (error) {
       return "error"
    }
};

export const getRecommendations = async (songName) => {
    try {
        // Search for the songName and retrieve the artist and track dynamically
        const { artist, track } = await searchSong(songName);

        // Get similar songs based on retrieved artist and track
        const similarSongs = await getSimilarSongs(artist, track, 20);

        // Log and return the similar songs
        if(similarSongs.length>0){

        return similarSongs;
        }
        else{
            return "error";
        }
    } catch (error) {
        return "error"
    }
};