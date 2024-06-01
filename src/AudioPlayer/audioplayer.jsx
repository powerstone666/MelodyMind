import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
function AudioPlayerr(){
return(
    <div className='fixed bottom-0 w-full bg-white'>
    <AudioPlayer
    autoPlay
    src="http://example.com/audio.mp3"
    onPlay={e => console.log("onPlay")}
    className='bg-deep-blue'
  />
  </div>
)
}
export default AudioPlayerr;