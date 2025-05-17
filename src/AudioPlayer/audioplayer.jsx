import React, { useContext, useEffect, useState, useCallback } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Context } from "../context.js"; 
import useMediaQuery from "../useMedia";
import he from "he";
import { searchResult, searchSuggestion, newsearch } from "../saavnapi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { addRecents } from "../Firebase/database";
import './custom-audioplayer.css'; // We'll create this file later

function AudioPlayerComponent() {
  const isAboveMedium = useMediaQuery("(min-width:1025px)"); 
  const { songid, setSongid, setSelected, spotify, setSpotify } = useContext(Context);
  const [music, setMusic] = useState("");
  const [names, setNames] = useState("");
  const [prev, setPrev] = useState([]);
  const [array, setArray] = useState("");
  const [image, setImage] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [artists, setArtists] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check if the browser supports the Media Session API
  useEffect(() => {
    if ("mediaSession" in navigator && names) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: names,
        album: array,
        artist: artists,
        artwork: [
          { src: image, sizes: "96x96", type: "image/jpeg" },
          { src: image, sizes: "128x128", type: "image/jpeg" },
          { src: image, sizes: "192x192", type: "image/jpeg" },
          { src: image, sizes: "256x256", type: "image/jpeg" },
          { src: image, sizes: "384x384", type: "image/jpeg" },
          { src: image, sizes: "512x512", type: "image/jpeg" },
        ],
      });
    }
  }, [names, array, image, artists]);

  const fetchSongData = async () => {
    setIsLoading(true);
    try {
      const res = await searchResult(songid);
      const decodedName = he.decode(res.data.data[0].name);
      const artistName = res.data.data[0].artists.primary[0].name;
      
      if (decodedName) {
        setSpotify(artistName + " " + decodedName);
      }
      
      setArtists(artistName);
      setArray(res.data.data[0].album.name);
      setImage(res.data.data[0].image[1].url);
      setNames(decodedName);
      const url = res.data.data[0].downloadUrl[4].url;
      setMusic(url);
    } catch (error) {
      console.error("Error fetching song data:", error);
      toast.error("Failed to load song. Please try another one.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (songid) {
      fetchSongData();
    }
  }, [songid]);

  const handleNext = useCallback(async () => {
    if (isFetching) return; // Prevent multiple calls
    setIsFetching(true);

    try {
      const prevItem = { name: spotify, id: songid };
      setPrev((prevState) => [...prevState, prevItem]);

      const res = await searchSuggestion(songid);
      let i = 0;
      while (i < res.data.length && prev.some((item) => item.id === res.data[i].id)) {
        i++;
      }

      if (i === res.data.length) {
        toast.error("No more songs to play, please go back and select another song.");
        setIsFetching(false);
        return; 
      }
      localStorage.setItem("songid", res.data[i].id);
      setSongid(res.data[i].id);

      setSpotify(res.data[i].artists.primary[0].name + " " + res.data[i].name);

      const user = JSON.parse(localStorage.getItem("Users"));
      if (user) {
        await addRecents(user.uid, res.data[i].id, he.decode(res.data[i].name), res.data[i].image[1].url); 
      }
    } catch (error) {
      console.error("Error handling next song:", error);
      toast.error("No more songs to play, please go back and select another song.");
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, songid, prev, spotify, setSongid, setSpotify]);

  const handlePrev = useCallback(async () => {
    if (prev.length === 0) {
      toast.error("No previous songs available");
      return;
    }
    
    const last = prev[prev.length - 1];
    const ressongId = last.id;
    localStorage.setItem("songid", ressongId);
    setSongid(ressongId);
    setSpotify(last.name);

    setPrev((prevState) => prevState.slice(0, -1));
  }, [prev, setSongid, setSpotify]); 

  useEffect(() => {
    // Set up Media Session API handlers
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("nexttrack", handleNext);
      navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
    }
    
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
      }
    };
  }, [handleNext, handlePrev]);

  const setdisplay = () => {
    localStorage.setItem("selected", "innersong");
    setSelected("innersong");
  };

  // Loading placeholder for the player
  const LoadingState = () => (
    <div className="flex animate-pulse items-center gap-4 p-4 w-full">
      <div className="rounded-lg bg-deep-grey h-14 w-14"></div>
      <div className="flex-1">
        <div className="h-4 bg-deep-grey rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-deep-grey rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      {isAboveMedium ? (
        <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-deep-blue/90 border-t border-gray-700 shadow-lg z-50 animate-slideUp">
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="flex items-center gap-4 px-6 py-3 max-w-7xl mx-auto">
              <div
                className="flex items-center gap-4 min-w-[240px] hover:cursor-pointer group"
                onClick={setdisplay}
              >
                <Link to="innersong" className="block">
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={image} 
                      alt={names}
                      className="h-16 w-16 object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col">
                  <h1 className="text-sm font-semibold truncate max-w-[160px]">{names}</h1>
                  <p className="text-xs text-gray-400 truncate max-w-[160px]">{artists}</p>
                </div>
              </div>
              
              <div className="flex-1">
                <AudioPlayer
                  showSkipControls
                  onClickNext={handleNext}
                  onClickPrevious={handlePrev}
                  onEnded={handleNext}
                  src={music}
                 // className="custom-player"
                  showJumpControls={true}
                    showFilledVolume={false}
                  layout="stacked-reverse"
                  customProgressBarSection={[
                    "CURRENT_TIME",
                    "PROGRESS_BAR",
                    "DURATION",
                  ]}
                  className="bg-transparent" 
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="fixed bottom-16 inset-x-0 backdrop-blur-md bg-deep-blue/90 border-t border-gray-700 shadow-lg z-50 animate-slideUp">
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="p-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <Link to="innersong" className="flex items-center gap-2" onClick={setdisplay}>
                  <img src={image} alt={names} className="h-10 w-10 rounded-md" />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs font-bold truncate">{names}</h2>
                    <p className="text-xs text-gray-400 truncate">{artists}</p>
                  </div>
                </Link>
              </div>
              
              <AudioPlayer
                src={music}
                //showSkipControls
                onClickNext={handleNext}
                onClickPrevious={handlePrev}
                onEnded={handleNext}
                //className="custom-player-mobile"
                showJumpControls={true}
                showFilledVolume={false}
                layout="horizontal-reverse"
                customControlsSection={["MAIN_CONTROLS"]}
                customProgressBarSection={[
                  "PROGRESS_BAR"
                ]}
                    className="bg-transparent" 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AudioPlayerComponent;
