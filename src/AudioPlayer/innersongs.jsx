import React, { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../context.js"; // Updated import
import useMediaQuery from "../useMedia";
import { searchResult, newsearch, searchSuggestion } from "../saavnapi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLyrics } from "../gemini";
import { getSongRecommendations } from "../gemini";
import he from "he";
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
        const songData = res.data.data[0];

        setDetails(songData);
        setSongName(songData.name);
        setDownload(songData.downloadUrl[4].url);
        console.log(songData)
        const lyricdata = await getLyrics(
          songData.artists.all[0].name,
          songData.name,
          songData.album.name,
          songData.year,
         songData.language
        );
        const decodedName = he.decode(songData.name);
       
        setImage(songData.image[2].url);
         setSongName(decodedName);
        
        setLyrics(lyricdata);
      } catch (error) {
        setLyrics("Lyrics Not found");
      }
    }
    setLoading(true);
  }, [songid, setLyrics]);

  const fetchRecommendations = useCallback(async () => {
      if (
        details &&
        details.name &&
        details.artists &&
        details.artists.all &&
        details.artists.all[0] &&
        details.artists.all[0].name
      ) {
        try {
          const rec = await getSongRecommendations(
            details.name,
            details.artists.all[0].name
          );

          if (typeof rec === "string") {
             setRecommendation(JSON.parse(rec).map(item => ({...item, song:item.song.replace(/['"]/g,''),artist:item.artist.replace(/['"]/g,'')})));
          } else {
            setRecommendation(rec.map(item => ({...item, song:item.song.replace(/['"]/g,''),artist:item.artist.replace(/['"]/g,'')})));
          }
           
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
       
  }, [details]);

  useEffect(() => {
    if (details.name) {
        fetchRecommendations();
    }
  }, [details.name]);


    useEffect(() => {
    fetchLyrics();
  }, [songid,setLyrics]);

  const play = async (songName) => {
      const res = await newsearch(songName);
      localStorage.setItem("spotify", songName);
      setSpotify(songName);
      localStorage.setItem("songid", res);
      setSongid(res)
  };

  const style = `text-white bg-melody-pink-600 border-0 rounded-xl shadow-inner shadow-melody-pink-500/30`;
  const handleLikes = async () => {
    try {
      setLiked(true);
      const name = he.decode(details.name);
      const image = details.image?.[2]?.url;
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
        <div className="flex flex-col items-center h-screen overflow-y-scroll no-scrollbar mb-24">
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
              <div className="border-1 bg-melody-purple-800 border border-melody-purple-700 rounded-lg h-1/2 mb-6 p-4 ">
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
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/3641/3641323.png"
                            className="h-8 mr-2"
                            onClick={handleLikes}
                        />
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
              <div className="h-14 bg-melody-purple-800 flex justify-center w-96 border border-melody-purple-700 rounded-xl items-center mb-8">
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
                <div>
                  {recommendation.map((song, index) => (
                    <div
                      className="bg-melody-purple-800 flex items-center p-4 m-2 cursor-pointer rounded-lg border border-melody-purple-700 hover:border-melody-pink-600/50 hover:shadow-melody-pink-600/30 hover:shadow-md transition-all duration-300"
                      key={index}
                      onClick={() => play(song.song)}
                    >
                      <h1 className="text-sm w-12">#{index + 1}</h1>
                      <div className="flex flex-col flex-grow ml-4 gap-1">
                            <h1 className="text-md font-bold">{song.song}</h1>
                            <h1 className="text-xs font-semibold text-gray-400">{song.artist} <span className="font-normal">{song.movie && `~ ${song.movie}`}</span>
                            </h1>
                         
                        </div>
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
                   <div className="text-xl whitespace-pre-line no-scrollbar">
                     {lyrics ? lyrics : "Lyrics Not found"}
                    </div>
                 
                </div>
              )}
            </>
          ) : (
            <>
              <div className="border-1 bg-melody-purple-800 border border-melody-purple-700 rounded-lg h-2/6 mb-6 p-4 flex-col">
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
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/3641/3641323.png"
                            className="h-8 mr-2"
                            onClick={handleLikes}
                        />
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
              <div className="h-14 bg-melody-purple-800 flex justify-center w-56 border border-melody-purple-700 rounded-xl items-center mb-8">
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
                  {recommendation.map((song, index) => (
                        <div className="bg-melody-purple-800 flex items-center p-4 m-2 cursor-pointer rounded-lg border border-melody-purple-700 hover:border-melody-pink-600/50 hover:shadow-melody-pink-600/30 hover:shadow-md transition-all duration-300" key={index} onClick={() => play(song.song)}>
                         <h1 className="text-sm w-12">#{index + 1}</h1>
                         <div className="flex flex-col flex-grow ml-4 gap-1">
                           <h1 className="text-md font-bold">{song.song}</h1>
                             <h1 className="text-xs font-semibold text-gray-400">{song.artist}<span className="font-normal">{song.movie && `~ ${song.movie}`}</span>
                           
                            
                            
                            </h1>
                        
                            </div>
                           
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
                  <div              className="text-md whitespace-pre-line no-scrollbar">
                    {lyrics ? lyrics : "Lyrics Not found"}
                  </div>
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
