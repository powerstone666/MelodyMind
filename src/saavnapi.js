
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

        if (names && names.includes("New Release")) {
            searchTerm = `latest releases ${year} ${language}`;
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
            
        console.log('Search query:', searchTerm, 'API endpoint:', apiEndpoint); // For debugging
        
        let res;
          if (apiEndpoint.includes('charts') || apiEndpoint.includes('trending')) {
            // First try with charts/trending API
            try {
                res = await axios.get(apiEndpoint);
                console.log('Special API response:', res.data);
                
                // Handle trending API response
                if (apiEndpoint.includes('trending') && res?.data?.data) {
                    // For trending endpoint
                    if (Array.isArray(res.data.data.songs)) {
                        return res.data.data.songs;
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
                console.log('Falling back to search API:', err.message);
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
                    console.log('Found weekly hits from trending songs');
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
                        console.log('Found weekly hits from charts');
                        return topChart.songs;
                    }
                    
                    // If no matching chart found but we have charts, use the first one
                    if (chartsRes.data.data[0]?.songs) {
                        console.log('Using first available chart for weekly hits');
                        return chartsRes.data.data[0].songs;
                    }
                }
            } catch (err) {
                console.log('Failed to get weekly hits from specialized endpoints:', err.message);
            }
        }
        
        // Fallback to search if all else fails
        res = await axios.request(options);
        
        if (res?.data?.data?.results) {
            console.log('API returned results:', res.data.data.results.length);
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
          console.log("saavn intake"+" "+names)
      const res=await Searchsongs(names);
 
      return res.songs.results[0].id;
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }