import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Context } from '../main';
import useMediaQuery from '../useMedia';
import axios from 'axios';
import { searchResult, searchSuggestion } from '../saavnapi';
function AudioPlayerr(id){
  const isAboveMedium = useMediaQuery('(min-width:768px)');
  const [music, setMusic] = useState("");
   const {songid,setSongid}=useContext(Context);
   const [names,setNames]=useState("");
   const [prev,setPrev]=useState([]);
   //https://aac.saavncdn.com/988/90435b10865dcbbac2f4a53cc237e097_320.mp4
  const response = async () => {
    try {
      const res=await searchResult(songid);
     const name= res.data.data[0].name
      setNames(name);
      const url = res.data.data[0].downloadUrl[4].url;
      setMusic(url);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if(songid)
    response();
  }, [songid]);

  const handleNext = async () => {
    setPrev([...prev, songid]);
    const res = await searchSuggestion(songid);
    
    let i = 0;
    while (i < 10 && prev.includes(res.data[i].id)) {
      i++;
    }
    
    localStorage.setItem('songid', res.data[i].id);
    setSongid(res.data[i].id);
  };
  
  const handleprev=()=>{
    const last=prev.pop();
    localStorage.setItem('songid',last)
    setSongid(last);
  }

  return (
    <div>
      {isAboveMedium ? (
        <div className='fixed bottom-0 w-full bg-deep-blue'>
          <h1>{names}</h1>
          <AudioPlayer
          autoPlay
             showSkipControls
             onClickNext={handleNext}
              onClickPrevious={handleprev}
              onEnded={handleNext}
            src={music}
            
            className='bg-deep-blue w-5/6'
          />
        </div>
      ) : (
        <div className='fixed bottom-20 w-full bg-deep-blue'>
          <AudioPlayer
            src={music}
            showSkipControls
            onClickNext={handleNext}
            onEnded={handleNext}
            className='bg-deep-blue w-5/6'
          />
        </div>
      )}
    </div>
  );
  
}
export default AudioPlayerr;