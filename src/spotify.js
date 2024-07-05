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

// Refresh the token immediately and then every 15 minutes
getAccessToken();
setInterval(getAccessToken, 15 * 60 * 1000); // 15 minutes

const fetchWebApi = async (endpoint, method, body) => {
    try {
        const res = await fetch(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method,
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            console.log(`Error status: ${res.status}`);
            return "error";
        }

        const res2 = await res.json();
        return res2;
    } catch (error) {
        console.error('Error fetching from Spotify API:', error);
        return "error";
    }
};

export const getRecommendations = async (songName) => {
    try {
        const getTopTracks = async () => {
            try {
                const res5 = await fetchWebApi(
                    `v1/search?q=${songName}&type=track&limit=1`, 'GET'
                );
                return res5;
            } catch {
                return "error";
            }
        };

        const topTracks = await getTopTracks();
        if (!topTracks || topTracks === "error") {
            return "error";
        }

        const id = topTracks.tracks.items[0].id;
        try {
            const res4 = await fetchWebApi(
                `v1/recommendations?seed_tracks=${id}`, 'GET'
            );

            return res4;
        } catch (error) {
            return "error";
        }
    } catch (error) {
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