import React from 'react';
import axios from 'axios';
import { useState } from 'react';
export const topsongs=async ()=>{
    const [music, setMusic] = useState([]);
  try{
    const options = {
        method: 'GET',
        url: "http://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/songs/ayedilhaimushkil"
      };
      const res = await axios.request(options);
      setMusic(res.data.data.songs.result);
      console.log(music)
  }
  catch(e)
  {
        console.log(e);
  }
  

}