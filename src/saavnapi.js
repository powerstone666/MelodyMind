
import axios from 'axios';
export const MelodyMusicsongs=async(names)=>{
    try {
        const options = {
            method: 'GET',
            url: 'https://saavn.dev/api/search/songs',
            params: { query: names ? names : 'topsongs',
            limit: 50
             }
        };
        const res = await axios.request(options);
        return res.data.data.results;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export const searchResult=async(songid)=>{
    const options = {
        method: 'GET',
        url: `https://saavn.dev/api/songs/${songid}`
      };
      const res = await axios.request(options);
      return res;
    }

export const searchSuggestion=async(songid)=>{
    const options = {
        method: 'GET',
        url: `https://saavn.dev/api/songs/${songid}/suggestions`
      };
      
      try {
        const { data } = await axios.request(options);
        return data.data[0].id;
      } catch (error) {
        console.error(error);
      }
     
    }

    export const albumsongs=async()=>{
        const options = {
            method: 'GET',
            url: 'http://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/search/albums',
            params: {query: 'Bollywood',limit:30}
          };
        const res = await axios.request(options);
        return res;
    }