import React, { useContext, useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import he from "he";
import { searchResult, searchSuggestion, newsearch } from "../saavnapi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { getRecommendations } from "../spotify";
import { addRecents } from "../Firebase/database";

function AudioPlayerComponent() {
  const isAboveMedium = useMediaQuery("(min-width:1025px)");
  const { songid, setSongid, setSelected, spotify, setSpotify } = useContext(Context);
  const [music, setMusic] = useState("");
  const [names, setNames] = useState("");
  const [prev, setPrev] = useState([]);
  const [array, setArray] = useState("");
  const [image, setImage] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  // Check if the browser supports the Media Session API
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: names,
        album: array,
        artist: " ",
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
  }, [names, array, image]);

  const fetchSongData = async () => {
    try {
      const res = await searchResult(songid);
      const decodedName = he.decode(res.data.data[0].name);
     
      if (decodedName) {
        localStorage.setItem("spotify", res.data.data[0].artists.primary[0].name + " " + decodedName);
        setSpotify(res.data.data[0].artists.primary[0].name + " " + decodedName);
      }
      setArray(res.data.data[0].album.name);
      setImage(res.data.data[0].image[1].url);
      setNames(decodedName);
      const url = res.data.data[0].downloadUrl[4].url;
      setMusic(url);
    } catch (error) {
      console.error("Error fetching song data:", error);
    }
  };

  useEffect(() => {
    if (songid) {
      fetchSongData();
    }
  }, [songid]);

  const handleNext = async () => {
    if (isFetching) return; // Prevent multiple calls
    setIsFetching(true);

    try {
      const prevItem = { name: spotify, id: songid };
      setPrev([...prev, prevItem]);

      const res2 = await getRecommendations(spotify);

      if (res2 === "error") {
        const res = await searchSuggestion(songid);
        let i = 0;
        while (i < res.data.length && prev.some(item => item.id === res.data[i].id)) {
          i++;
        }

        if (i === res.data.length) {
          toast.error('No more songs to play, please go back and select another song.');
          setIsFetching(false);
          return;
        }
        localStorage.setItem('songid', res.data[i].id);
        setSongid(res.data[i].id);
        localStorage.setItem("spotify", res.data[i].artists.primary[0].name + " " + res.data[i].name);
        setSpotify(res.data[i].artists.primary[0].name + " " + res.data[i].name);

        const user = JSON.parse(localStorage.getItem("Users"));
        if (user) {
          try {
            await addRecents(
              user.uid,
              res.data[i].id,
              he.decode(res.data[i].name),
              res.data[i].image[1].url
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        let i = 0;
        while (
          i < res2.tracks.length &&
          prev.some(item => item.name === res2.tracks[i].artists[0].name + " " + res2.tracks[i].name)
        ) {
          i++;
        }

        if (i === res2.tracks.length) {
          toast.error("No more songs to play, please go back and select another song.");
          setIsFetching(false);
          return;
        }

        const res3 = await newsearch(res2.tracks[i].name + " " + res2.tracks[i].artists[0].name);
        localStorage.setItem("songid", res3);
        setSongid(res3);
        localStorage.setItem("spotify", res2.tracks[i].artists[0].name + " " + res2.tracks[i].name);
        setSpotify(res2.tracks[i].artists[0].name + " " + res2.tracks[i].name);

        const user = JSON.parse(localStorage.getItem("Users"));
        if (user) {
          try {
            await addRecents(
              user.uid,
              res2.tracks[i].id,
              res2.tracks[i].name,
              res2.tracks[i].album.images[0].url
            );
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      console.error("Error handling next song:", error);
      toast.error("No more songs to play, please go back and select another song.");
    } finally {
      setIsFetching(false); // Reset the fetching state
    }
  };

  const handlePrev = async () => {
    if (prev.length === 0) {
      toast.error("No previous songs available");
      return;
    }

    const last = prev[prev.length - 1];
    const res3 = last.name;
    const res = await newsearch(res3);
    localStorage.setItem("songid", res);
    setSongid(res);
    setPrev(prev.slice(0, -1));
  };

  useEffect(() => {
    // Set up Media Session API handlers
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("nexttrack", handleNext);
      navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
    }
  }, [handleNext, handlePrev]);

  const setdisplay = () => {
    localStorage.setItem("selected", "innersong");
    setSelected("innersong");
  };

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
        theme="light"
        transition={Bounce}
      />
      {isAboveMedium ? (
        <div className="fixed bottom-0 w-screen bg-deep-blue">
          <div className="flex gap-4 justify-start items-center">
            <AudioPlayer
              showSkipControls
              onClickNext={handleNext}
              onClickPrevious={handlePrev}
              onEnded={handleNext}
              src={music}
              className="bg-deep-blue w-4/6"
            />
            <div
              className="flex flex-wrap items-center gap-4 hover:cursor-pointer"
              onClick={setdisplay}
            >
              <Link to="innersong">
                {" "}
                <img src={image} className="h-16" />
              </Link>
              <h1 className="truncate">{names}</h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-20 w-screen bg-deep-blue">
          <div className="flex items-center gap-2">
            <AudioPlayer
              src={music}
              showSkipControls
              onClickNext={handleNext}
              showJumpControls={false}
              onClickPrevious={handlePrev}
              onEnded={handleNext}
              className="bg-deep-blue w-5/6"
              showFilledVolume={true}
            />
            <Link to="innersong">
              <img src={image} className="h-12" onClick={setdisplay} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioPlayerComponent;
