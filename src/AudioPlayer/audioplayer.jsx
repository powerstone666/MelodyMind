import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import axios from "axios";
import he from "he";
import { searchResult, searchSuggestion } from "../saavnapi";

function AudioPlayerComponent() {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { songid, setSongid } = useContext(Context);
  const [music, setMusic] = useState("");
  const [names, setNames] = useState("");
  const [prev, setPrev] = useState([]);
  const [array, setArray] = useState("");
  const [image,setimage]=useState("");
  const [isPlaying, setIsPlaying] = useState(true);
 // Check if the browser supports the Media Session API
if ('mediaSession' in navigator) {
  // Set metadata for the media being played
  navigator.mediaSession.metadata = new MediaMetadata({
    title: names,
    album: array,
    artist: ' ',
    artwork: [
      { src: image, sizes: '96x96', type: 'image/jpeg' },
      { src: image, sizes: '128x128', type: 'image/jpeg' },
      { src: image, sizes: '192x192', type: 'image/jpeg' },
      { src: image, sizes: '256x256', type: 'image/jpeg' },
      { src: image, sizes: '384x384', type: 'image/jpeg' },
      { src: image, sizes: '512x512', type: 'image/jpeg' },
    ],
  });
}
  

 


  const fetchSongData = async () => {
    try {
      const res = await searchResult(songid);
       setArray(res.data.data[0].album.name);
       setimage(res.data.data[0].image[1].url);
      const name = he.decode(res.data.data[0].name);
      setNames(name);
      const url = res.data.data[0].downloadUrl[4].url;
      setMusic(url);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (songid) {
      fetchSongData();
    }
  }, [songid]);

  const handleNext = async () => {
    setPrev([...prev, songid]);
    const res = await searchSuggestion(songid);
  
    let i = 0;
    while (i < res.data.length && prev.includes(res.data[i].id)) {
      i++;
    }
  
  if(i===res.data.length){
    i=0;
  }
  
    // Set the songid to the new unique song or the last song in the list
    localStorage.setItem("songid", res.data[i].id);
    setSongid(res.data[i].id);
  };
  

  const handlePrev = () => {
    const last = prev.pop();
    localStorage.setItem("songid", last);
    setSongid(last);
  };
  useEffect(() => {
    // Check if the Media Session API is supported
    if ("mediaSession" in navigator) {

     
       navigator.mediaSession.setActionHandler('nexttrack', function() {
    // Handle next track action
                 handleNext();
  });

  navigator.mediaSession.setActionHandler('previoustrack', function() {
    // Handle previous track action
                handlePrev();
  });
    }

  }, [handlePrev, handleNext]);
  return (
    <div>
      {isAboveMedium ? (
        <div className="fixed bottom-0 w-full bg-deep-blue">
          <h1>{names}</h1>
          <AudioPlayer
            autoPlay
            showSkipControls
            onClickNext={handleNext}
            onClickPrevious={handlePrev}
            onEnded={handleNext}
            src={music}
            className="bg-deep-blue w-5/6"
            listenInterval={100}
          />
        </div>
      ) : (
        <div className="fixed bottom-20 w-full bg-deep-blue">
          <AudioPlayer
            src={music}
            showSkipControls
            onClickNext={handleNext}
             showJumpControls={false}
             onClickPrevious={handlePrev}              
                   autoPlay
                onEnded={handleNext}
            className="bg-deep-blue w-5/6"
            
            showFilledVolume={true}
          />
        </div>
      )}
    </div>
  );
}

export default AudioPlayerComponent;
