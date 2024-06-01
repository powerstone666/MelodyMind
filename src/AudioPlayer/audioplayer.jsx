import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Context } from '../main';
import useMediaQuery from '../useMedia';
import axios from 'axios';
function AudioPlayerr(id){
  const isAboveMedium = useMediaQuery('(min-width:768px)');
  const [music, setMusic] = useState("https://aac.saavncdn.com/988/90435b10865dcbbac2f4a53cc237e097_320.mp4");
   const {songid,setSongid}=useContext(Context);
  const response = async () => {
    try {
      const options = {
        method: 'GET',
        url: `http://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/songs/${songid}`
      };
      const res = await axios.request(options);
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

  return (
    <div>
      {isAboveMedium ? (
        <div className='fixed bottom-0 w-full bg-deep-blue'>
          <AudioPlayer
            src={music}
            onPlay={e => console.log("onPlay")}
            className='bg-deep-blue w-5/6'
          />
        </div>
      ) : (
        <div className='fixed bottom-20 w-full bg-deep-blue'>
          <AudioPlayer
            src={music}
            onPlay={e => console.log("onPlay")}
            className='bg-deep-blue w-5/6'
          />
        </div>
      )}
    </div>
  );
  
}
export default AudioPlayerr;