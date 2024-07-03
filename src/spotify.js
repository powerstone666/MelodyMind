import axios from 'axios';

const clientId = import.meta.env.VITE_CLIENT;
const clientSecret = import.meta.env.VITE_SECRET;

let token = null;
let tokenExpiry = null;

const getAccessToken = async () => {
    if (token && tokenExpiry && new Date() < tokenExpiry) {
        return token;
    }

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
        // Set the token expiry to 1 hour from now
        tokenExpiry = new Date(new Date().getTime() + response.data.expires_in * 1000);
        return token;
    } catch (error) {
        return "error";
    }
};

// Fetch initial token and set up the expiry
getAccessToken().then(initialToken => {
    token = initialToken;
});

async function fetchWebApi(endpoint, method, body) {
    try {
        // Ensure token is valid
        const validToken = await getAccessToken();

        const res = await fetch(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${validToken}`
            },
            method,
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            // Handle errors, such as rate limiting
            if (res.status === 429) {
                const retryAfter = res.headers.get('Retry-After');
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                return fetchWebApi(endpoint, method, body);
            }
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const res2 = await res.json();
        return res2;
    } catch (error) {
        return "error";
    }
}

export const getRecommendations = async (songName) => {
    try {
        const getTopTracks = async () => {
            return (await fetchWebApi(
                `v1/search?q=${songName}&type=track&limit=1`, 'GET'
            ));
        };

        const topTracks = await getTopTracks();
        if (!topTracks || topTracks === "error") {
            return "error";
        }

        const id = topTracks.tracks.items[0].id;
       try{
        const res4 = await fetchWebApi(
            `v1/recommendations?seed_tracks=${id}`, 'GET'
        );

        return res4;
    }
    catch(error)
    {
        return "error"
    }
    } catch (error) {
        return "error";
    }
};
