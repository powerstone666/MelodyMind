
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
        const options = {
            method: 'GET',
            url: 'https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/search/songs',
            params: { query: names ? language+" "+names : `topsongs ${language}`,
            limit: 50
             }
        };
        const res = await axios.request(options);
        return res.data.data.results;
      
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
export const Searchsongs=async(names)=>{
  try {
      const language=languages();
      const options = {
          method: 'GET',
          url: 'https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/search',
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
          url: 'https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/search/songs',
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
        url: `https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/songs/${songid}`
      };
      const res = await axios.request(options);
      return res;
    }
}

export const searchSuggestion=async(songid)=>{
    const options = {
        method: 'GET',
        url: `https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/songs/${songid}/suggestions`,
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
            url: 'https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/search/albums',
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
            url: 'https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/albums',
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
            url: "https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/search/artists",
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
            url: `https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/artists/${id}`,
            params: {limit:50 },
          };
          const res = await axios.request(options);
        
          return res;
        }catch(error){
          console.error('Error fetching data:', error);
        }
    }

    export const songLyrics=async(songid)=>{
      const options = {method: 'GET', url: `https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/songs/${songid}/lyrics`};

try {
  const { data } = await axios.request(options);
  return data;
} catch (error) {
  console.error(error);
}
    }
    export const songBymood=async(mood)=>{
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
            url: 'https://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/search/songs',
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