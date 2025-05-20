import axios from 'axios';

var  sharedLanguage= '';
export const getLanguages=async(languages)=>{
    try {
       sharedLanguage =languages;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
export const languages=()=>sharedLanguage;
export const MelodyMusicsongs=async(names)=>{
    try {
        const language=languages();
        const year = new Date().getFullYear();        // Enhanced search terms for different types of queries
        let searchTerm;
        let apiEndpoint = 'https://saavn.dev/api/search/songs';

        if (names && names.includes("New Release")) {            searchTerm = `latest releases ${year} ${language}`;
            // Try charts API for new releases
            apiEndpoint = 'https://saavn.dev/api/charts';
        } else if (names && names.includes("Weekly Hits")) {
            searchTerm = `hit songs  ${language}`;
            // Use dedicated trending API for weekly hits
            apiEndpoint = 'https://saavn.dev/api/trending';
        } else if (names && names.includes("Top Songs")) {
            searchTerm = `top songs ${year} ${language}`;
            // Try trending API for top songs
            apiEndpoint = 'https://saavn.dev/api/trending';
        } else if (names && names.includes("new songs")) {
            searchTerm = `${names} ${language}`;
        } else {
            searchTerm = names ? `${language} ${names}` : `topsongs ${language}`;
        }
        
        let res;
          if (apiEndpoint.includes('charts') || apiEndpoint.includes('trending')) {
            // First try with charts/trending API
            try {
                res = await axios.get(apiEndpoint);
                
                // Handle trending API response
                if (apiEndpoint.includes('trending') && res?.data?.data) {
                    // For trending endpoint
                    if (Array.isArray(res.data.data.songs)) {                    return res.data.data.songs;
                    } else if (Array.isArray(res.data.data.trending)) {
                        return res.data.data.trending.songs || res.data.data.trending;
                    }
                }
                
                // Handle charts API response
                if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
                    // Take the first chart data
                    const chartData = res.data.data[0];
                    if (chartData?.songs && Array.isArray(chartData.songs)) {
                        return chartData.songs;
                    }
                }
            } catch (err) {
                // Fall back to search API if charts/trending fails
            }
        }
          // Default to search API if the specialized endpoints don't work
        const options = {
            method: 'GET',
            url: 'https://saavn.dev/api/search/songs',
            params: { 
                query: searchTerm,
                limit: 50
            }
        };
        
        // Special handling for Weekly Hits
        if (names && names.includes("Weekly Hits")) {
            // Try multiple approaches to get weekly hits
            try {
                // First try with trending API
                const trendingRes = await axios.get('https://saavn.dev/api/trending');
                if (trendingRes?.data?.data?.songs && Array.isArray(trendingRes.data.data.songs)) {
                    return trendingRes.data.data.songs;
                }
                
                // If that fails, try with top charts
                const chartsRes = await axios.get('https://saavn.dev/api/charts');
                if (chartsRes?.data?.data && Array.isArray(chartsRes.data.data) && chartsRes.data.data.length > 0) {
                    const topChart = chartsRes.data.data.find(chart => 
                        chart.title.toLowerCase().includes('weekly') || 
                        chart.title.toLowerCase().includes('top') || 
                        chart.title.toLowerCase().includes('trending')
                    );
                    
                    if (topChart?.songs && Array.isArray(topChart.songs)) {
                        return topChart.songs;
                    }
                    
                    // If no matching chart found but we have charts, use the first one
                    if (chartsRes.data.data[0]?.songs) {
                        return chartsRes.data.data[0].songs;
                    }
                }
            } catch (err) {
                console.error('Failed to get weekly hits:', err.message);
            }
        }
        
        // Fallback to search if all else fails
        res = await axios.request(options);
        
        if (res?.data?.data?.results) {
            return res.data.data.results;
        } else {
            console.error('Invalid API response structure');
            return [];
        }
      
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
export const Searchsongs=async(names)=>{
  try {
      const language=languages();
      const options = {
          method: 'GET',
          url: 'https://saavn.dev/api/search',
          params: { query: names ? names : `topsongs ${language}`,
          limit: 20
           }
      };
      const res = await axios.request(options);
   
      return res.data.data;

  } catch (error) {
      console.error('Error fetching data:', error);
  }
}
export const Searchsongs2=async(names)=>{
  try {
      const language=languages();
      const options = {
          method: 'GET',
          url: 'https://saavn.dev/api/search/songs',
          params: { query: names ? names : `topsongs ${language}`,
          limit: 40
           }
      };
      const res2 = await axios.request(options);
  
      return res2.data.data;

  } catch (error) {
      console.error('Error fetching data:', error);
  }
}
export const searchResult=async(songid)=>{
    if(songid){
    const options = {
        method: 'GET',
        url: `https://saavn.dev/api/songs/${songid}`
      };
      const res = await axios.request(options);
      return res;
    }
}

export const searchSuggestion=async(songid)=>{
    const options = {
        method: 'GET',
        url: `https://saavn.dev/api/songs/${songid}/suggestions`,
        params: {limit: 20}
      };
    
      
      try {
        const { data } = await axios.request(options);
     
        return data;
      } catch (error) {
        console.error(error);
      }
     
    }

    export const albumsongs=async()=>{
      try{
        const language=languages();
        const options = {
            method: 'GET',
            url: 'https://saavn.dev/api/search/albums',
            params: {query: language,limit:50}
          };
        const res = await axios.request(options);
        return res;
      }catch(error){
          console.error('Error fetching data:', error);
      }
    }
    
    export const albumsongsinner=async(id)=>{
      try{
        const language=languages();
        const options = {
            method: 'GET',
            url: 'https://saavn.dev/api/albums',
            params: {id:id,limit:50}
          };
        const res = await axios.request(options);
        return res;
      }catch(error){
          console.error('Error fetching data:', error);
      }
    }
    export const artist=async()=>{
      try{
        const language=languages();
        const options = {
            method: "GET",
            url: "https://saavn.dev/api/search/artists",
            params: { query:"Top Artists",limit:50 },
          };
          const res = await axios.request(options);

          return res;
        }catch(error){
          console.error('Error fetching data:', error);
        }
    }

    export const artistSongs=async(id)=>{
      try{
        const language=languages();
        const options = {
            method: "GET",
            url: `https://saavn.dev/api/artists/${id}`,
            params: {limit:50 },
          };
          const res = await axios.request(options);
        
          return res;
        }catch(error){
          console.error('Error fetching data:', error);
        }
    }

    export const getLyrics = async (artist, title) => {
        try {
          const response = await axios.get(
            `https://api.lyrics.com/v1/${artist}/${title}`
          );
          return response.data.lyrics;
        } catch (error) {
          console.error("Error fetching lyrics:", error);
          return "Lyrics not found";
        }
    };
    export const songBymood = async (mood) => {
      try{
        if(mood==="neutral")
          {
            mood="top";
          }
          else if(mood==="surprised")
          {
              mood="random"
            }
        const language=languages();
        const options = {
            method: 'GET',
            url: 'https://saavn.dev/api/search/songs',
            params: { query:mood+" songs "+language,
            limit: 10
             }
          };
          const res = await axios.request(options);
          return res;
        }catch(error){
          console.error('Error fetching data:', error);
        }
    }  
     export const newsearch=async(names)=>{
    try {
      // Validate input
      if (!names || typeof names !== 'string' || names === 'undefined') {
        console.error("Invalid query for song search:", names);
        return null;
      }
        // Trim and validate the search query
      let query = names.trim();
      
      // Remove any quotes from the query
      query = query.replace(/["']/g, '');
      
      if (query.length < 3) {
        console.error("Search query too short:", query);
        return null;
      }
      
      // Add retries for API calls
      let attempts = 0;
      const maxAttempts = 2;
      let res = null;
      
      while (attempts < maxAttempts) {
        try {
          res = await Searchsongs(query);
          if (res && res.songs && res.songs.results && res.songs.results.length > 0) {
            break; // Success, exit the loop
          }
            // If we get here, the API returned successfully but with no results
          
          // Try with a simplified query on the second attempt
          if (attempts === 0 && query.includes(' ')) {
            // Extract just the first two words if the query is too complex
            const simplifiedQuery = query.split(' ').slice(0, 2).join(' ');
            if (simplifiedQuery !== query) {
              query = simplifiedQuery;
            }
          }
          
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between attempts
        } catch (error) {
          console.error(`API call failed on attempt ${attempts + 1}:`, error);
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Longer delay after an error
          }
        }
      }
      
      // Validate results
      if (!res || !res.songs || !res.songs.results || res.songs.results.length === 0) {
        console.warn("No search results found for:", query);
        return null;
      }
      
      return res.songs.results[0].id;
    }
    catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

// Fetch playlists for a category (Quick Access)
export const fetchPlaylistsByCategory = async (category) => {
  try {
    const res = await axios.get('https://saavn.dev/api/search/playlists', {
      params: { query: category, limit: 12 }
    });
    if (res?.data?.data?.results) {
      return res.data.data.results;
    }
    return [];
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};

// Fetch playlist details by ID
export const fetchPlaylistDetails = async (playlistId) => {
  try {
    const res = await axios.get('https://saavn.dev/api/playlists', {
      params: { id: playlistId }
    });
    // Extract external URL if available
    if (res?.data?.data) {
      const playlistData = res.data.data;
      // Try to find a URL field (commonly 'url' or 'perma_url')
      const externalUrl = playlistData.url || playlistData.perma_url || null;
      return { ...playlistData, externalUrl };
    }
    return null;
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    return null;
  }
};