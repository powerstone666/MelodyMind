import React, { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import {
  searchResult,
  searchSuggestion,
  songLyrics,
  newsearch,
} from "../saavnapi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import he from "he";
import { getRecommendations } from "../spotify";
import { addLikes, deleteLikes, fetchUser } from "../Firebase/database";
import { auth } from "../Firebase/firebaseConfig";

function Innersongs() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const { songid, lyrics, setLyrics, setSongid, spotify, setSpotify } =
    useContext(Context);
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [songName, setSongName] = useState("");
  const [midsection, setMidsection] = useState("song");
  const [recommendation, setRecommendation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dloading, setDloading] = useState(false);
  const [download, setDownload] = useState("");
  const [liked, setLiked] = useState(false);
  const [dbId, setDbId] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetchUser();
        const foundSong = res.find((song) => song.songId === songid);
        if (foundSong) {
          setLiked(true);
          setDbId(foundSong.id);
        } else {
          setLiked(false);
          setDbId("");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchLikes();
  }, [songid]);

  const downloadAudio = async () => {
    const url = download;
    try {
      setDloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${songName}.mp3`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDloading(false);
      toast.success("Downloaded Successfully");
    } catch (error) {
      console.error("Error downloading audio:", error);
      toast.error("Download Failed");
      setDloading(false);
    }
  };

  const fetchLyrics = useCallback(async () => {
    setLoading(false);
    if (songid) {
      try {
        const res = await searchResult(songid);
        setDetails(res.data.data[0]);
        setDownload(res.data.data[0].downloadUrl[4].url);
        const new2 = he.decode(res.data.data[0].name);
        setSongName(new2);
        setImage(res.data.data[0].image[2].url);
      } catch (error) {
        console.error(error);
      }
      try {
        const res2 = await songLyrics(songid);
        const decodedRes = he.decode(res2.data.lyrics);
        setLyrics(decodedRes);
      } catch (error) {
        setLyrics("Lyrics Not found");
      }
    }
    setLoading(true);
  }, [songid, setLyrics]);

  const fetchRecommendations = async () => {
    if (isFetching) return; // Prevent multiple calls
    setIsFetching(true);
    try {
      setDloading(true);
      const res4 = await getRecommendations(spotify);
      if (res4 === "error") {
        const res3 = await searchSuggestion(songid);
        setRecommendation(
          res3.data.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1].url,
            artist: song.artists.primary[0].name,
            year: song.year,
            album: song.album.name,
          }))
        );
      } else {
        setRecommendation(
          res4.tracks.map((song) => ({
            name: he.decode(song.name),
            image: song.album.images[1].url,
            year: song.album.release_date.slice(0, 4),
            album: song.album.name,
            artist: song.artists[0].name,
          }))
        );
      }
      setDloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDloading(false);
    } finally {
      setIsFetching(false); // Reset the fetching state
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [spotify]);

  useEffect(() => {
    fetchLyrics();
  }, [fetchLyrics]);

  const play = async (id) => {
    const res = await newsearch(id);
    localStorage.setItem("spotify", id);
    setSpotify(id);
    localStorage.setItem("songid", res);
    setSongid(res);
  };

  const style = `text-white bg-red border-0 rounded-xl`;
  const handleLikes = async () => {
    try {
      setLiked(true);
      const name = he.decode(details.name);
      const image = details.image[2].url;
      const year = details.year;
      const songId = songid;
      await addLikes(songId, name, image, year, auth.currentUser.uid);
    } catch (error) {
      console.error(error);
      toast.error("Failed to like song");
    }
  };

  const handleDelete = async () => {
    try {
      setLiked(false);
      await deleteLikes(dbId);
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlike song");
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center h-screen overflow-y-scroll mb-24">
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
            <>
              <div className="border-1 bg-deep-grey h-1/2 mb-6 p-4 ">
                <img src={image} alt="song" className="h-full" />
              </div>
              <div className="flex gap-4 items-center justify-center mb-6">
                <h1 className="text-xl ">{songName}</h1>
                <div>
                  {!dloading ? (
                    <>
                      {liked ? (
                        <button onClick={handleDelete}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/16887/16887092.png"
                            className="h-8  mr-2"
                          />
                        </button>
                      ) : (
                        <button onClick={handleLikes}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/3641/3641323.png"
                            className="h-8 mr-2"
                          />
                        </button>
                      )}

                      <button onClick={downloadAudio}>
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/2810/2810387.png"
                          className="h-8 "
                        />
                      </button>
                    </>
                  ) : (
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                      className="animate-spin h-8"
                      viewBox="0 0 24 24"
                    />
                  )}
                </div>
              </div>
              <div className="h-14 bg-deep-grey flex justify-center w-96 border-0 rounded-xl items-center mb-8">
                <div
                  className={`${
                    midsection === "song" ? style : ""
                  } w-1/2 h-full p-4 flex justify-center cursor-pointer`}
                  onClick={() => setMidsection("song")}
                >
                  <h1>Song</h1>
                </div>
                <div
                  className={`${
                    midsection === "lyric" ? style : ""
                  } w-1/2 p-4 flex justify-center cursor-pointer `}
                  onClick={() => setMidsection("lyric")}
                >
                  <h1>Lyrics</h1>
                </div>
              </div>
              {midsection === "song" && (
                <div className="">
                  {recommendation
                    .slice(0, recommendation.length)
                    .map((song, index) => (
                      <div
                        className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                        key={song.id}
                        onClick={() => play(song.name + " " + song.artist)}
                      >
                        <h1 className="text-2xl w-12">#{index + 1}</h1>
                        <img src={song.image} className="h-12" />
                        <h1 className="text-md flex-grow">{song.year}</h1>
                        <h1 className="text-md flex-grow">{song.name}</h1>
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                          className="h-12"
                        />
                      </div>
                    ))}
                </div>
              )}
              {midsection === "lyric" && (
                <div>
                  <h1 className="text-3xl mb-2">
                    Movie: {""}{" "}
                    <span className="text-red">{he.decode(details.name)}</span>
                  </h1>
                  <h1 className="text-3xl mb-4">
                    Year: {""} <span className="text-red">{details.year}</span>
                  </h1>
                  <h1
                    className="text-xl"
                    dangerouslySetInnerHTML={{
                      __html: lyrics ? lyrics : "Lyrics Not found",
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="border-1 bg-deep-grey h-2/6 mb-6 p-4 flex-col">
                <img src={image} alt="song" className="h-full" />
              </div>
              <div className="flex gap-4 items-center justify-center mb-6">
                <h1 className="text-xl ">{songName}</h1>
                <div>
                  {!dloading ? (
                    <>
                      {liked ? (
                        <button onClick={handleDelete}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/16887/16887092.png"
                            className="h-8  mr-2"
                          />
                        </button>
                      ) : (
                        <button onClick={handleLikes}>
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/3641/3641323.png"
                            className="h-8 mr-2"
                          />
                        </button>
                      )}

                      <button onClick={downloadAudio}>
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/2810/2810387.png"
                          className="h-8 "
                        />
                      </button>
                    </>
                  ) : (
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                      className="animate-spin h-8"
                      viewBox="0 0 24 24"
                    />
                  )}
                </div>
              </div>
              <div className="h-14 bg-deep-grey flex justify-center w-56 border-0 rounded-xl items-center mb-8">
                <div
                  className={`${
                    midsection === "song" ? style : ""
                  } w-1/2 h-full p-4 flex justify-center cursor-pointer`}
                  onClick={() => setMidsection("song")}
                >
                  <h1>Song</h1>
                </div>
                <div
                  className={`${
                    midsection === "lyric" ? style : ""
                  } w-1/2 p-4 flex justify-center cursor-pointer `}
                  onClick={() => setMidsection("lyric")}
                >
                  <h1>Lyrics</h1>
                </div>
              </div>
              {midsection === "song" && (
                <div className="mb-36">
                  {recommendation
                    .slice(0, recommendation.length)
                    .map((song, index) => (
                      <div
                        className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                        key={song.id}
                        onClick={() => play(song.name + " " + song.artist)}
                      >
                        <h1 className="text-sm w-12">#{index + 1}</h1>
                        <img src={song.image} className="h-12" />
                        <h1 className="text-sm flex-grow">{song.year}</h1>
                        <h1 className="text-sm flex-grow">{song.name}</h1>
                      </div>
                    ))}
                </div>
              )}
              {midsection === "lyric" && (
                <div className="mb-36">
                  <h1 className="text-xl mb-2">
                    Movie: {""}{" "}
                    <span className="text-red">{he.decode(details.name)}</span>
                  </h1>
                  <h1 className="text-xl mb-4">
                    Year: {""} <span className="text-red">{details.year}</span>
                  </h1>
                  <h1
                    className="text-md flex-wrap"
                    dangerouslySetInnerHTML={{
                      __html: lyrics ? lyrics : "Lyrics Not found",
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <h1 className="text-2xl text-red">Loading....</h1>
      )}
    </>
  );
}

export default Innersongs;
