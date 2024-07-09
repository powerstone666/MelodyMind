import axios from 'axios';

const clientId = import.meta.env.VITE_CLIENT;
const clientSecret = import.meta.env.VITE_SECRET;

let token = null;

const getAccessToken = async () => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    try {
        const response = await axios.post(tokenUrl, params, { headers });
        token = response.data.access_token;
       
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
};

// Refresh the token immediately and then every 30 minutes
getAccessToken();
setInterval(getAccessToken, 30 * 60 * 1000); // 30 minutes

const fetchWebApi = async (endpoint, method, body) => {
    try {
        if (!token) {
            await getAccessToken(); // Ensure token is available
        }

        const res = await fetch(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method,
            body: body ? JSON.stringify(body) : null
        });

        if (!res.ok) {
            console.error(`Error status: ${res.status}`);
            return "error";
        }

        const res2 = await res.json();
        return res2;
    } catch (error) {
        console.error('Error fetching from Spotify API:', error);
        return "error";
    }
};

const levenshteinDistance = (a, b) => {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i])
        .map((row, i) => row.concat(Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : 0))));

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }

    return matrix[b.length][a.length];
};

export const getRecommendations = async (songName) => {
    try {
     
        const encodedSongName = encodeURIComponent(songName);
        const res5 = await fetchWebApi(`v1/search?q=${encodedSongName}&type=track&limit=2`, 'GET');
 
        
        if (!res5 || res5.error) {
            console.error('Error fetching top tracks:', res5.error);
            return "error";
        }

        const track1 = `${res5.tracks.items[0].artists[0].name} ${res5.tracks.items[0].name}`;
        const track2 = `${res5.tracks.items[1].artists[0].name} ${res5.tracks.items[1].name}`;

        const distance1 = levenshteinDistance(songName, track1);
        const distance2 = levenshteinDistance(songName, track2);

        const bestTrack = distance1 < distance2 ? res5.tracks.items[0] : res5.tracks.items[1];
        const id = bestTrack.id;

        const res4 = await fetchWebApi(`v1/recommendations?seed_tracks=${id}`, 'GET');
        if (res4.error) {
            console.error('Error fetching recommendations:', res4.error);
            return "error";
        }
      
        return res4;
    } catch (error) {
        console.error('Error in getRecommendations:', error);
        return "error";
    }
};


/*
const API_KEY =import.meta.env.VITE_LAST_FM;

const searchSong = async (songName) => {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${songName}&api_key=${API_KEY}&format=json`;

    try {
        const response = await axios.get(url);
        const searchResults = response.data.results.trackmatches.track;

        if (searchResults.length > 0) {
            // Assuming the first result is the most relevant
            const artist = searchResults[0].artist;
            const track = searchResults[0].name;
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
};*/