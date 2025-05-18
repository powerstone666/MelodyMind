import React, { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../context.js";
import useMediaQuery from "../useMedia";
import { searchResult, newsearch } from "../saavnapi";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLyrics, getSongRecommendations } from "../gemini";
import he from "he";
import { addLikes, deleteLikes, fetchUser } from "../Firebase/database";
import { recordUserActivity } from "../Firebase/userProfile";
import { auth } from "../Firebase/firebaseConfig";

function Innersongs() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const { songid, lyrics, setLyrics, setSongid, spotify, setSpotify } = useContext(Context);
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
      if (!url) {
        toast.error("No download link available for this song.");
        return;
      }
      setDloading(true);
      // Try fetch first
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
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
      // Fallback: open the link in a new tab
      window.open(url, "_blank");
      toast.error("Direct download failed. Opened the audio in a new tab. If it plays, right-click and save.");
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
          setRecommendation(
            JSON.parse(rec).map((item) => ({
              ...item,
              song: item.song.replace(/['"]/g, ""),
              artist: item.artist.replace(/['"]/g, ""),
            }))
          );
        } else {
          setRecommendation(
            rec.map((item) => ({
              ...item,
              song: item.song.replace(/['"]/g, ""),
              artist: item.artist.replace(/['"]/g, ""),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    }
  }, [details]);

  useEffect(() => {
    if (details.name) {
      fetchRecommendations();
    }
  }, [details.name, fetchRecommendations]);

  useEffect(() => {
    fetchLyrics();
  }, [songid, fetchLyrics]);

  const play = async (songName) => {
    try {
      const res = await newsearch(songName);
      localStorage.setItem("spotify", songName);
      setSpotify(songName);
      localStorage.setItem("songid", res);
      setSongid(res);
      toast.success(`Playing: ${songName}`, {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error playing song:", error);
      toast.error("Failed to play song. Please try again.");
    }
  };

  const style = `text-white bg-melody-pink-600 border-0 rounded-xl shadow-inner shadow-melody-pink-500/30`;

  const handleLikes = async () => {
    if (!auth.currentUser) {
      toast.error("Please sign in to like songs");
      return;
    }
    try {
      setLiked(true);
      const name = he.decode(details.name);
      const image = details.image?.[2]?.url;
      const year = details.year;
      const songId = songid;

      await addLikes(songId, name, image, year, auth.currentUser.uid);

      await recordUserActivity(
        auth.currentUser.uid,
        songId,
        name,
        details.primaryArtists || "Unknown Artist",
        "liked",
        image
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to like song");
      setLiked(false);
    }
  };

  const handleDelete = async () => {
    if (!auth.currentUser) {
      toast.error("Please sign in to unlike songs");
      return;
    }
    try {
      setLiked(false);
      await deleteLikes(dbId);

      const name = he.decode(details.name);
      const image = details.image?.[2]?.url;

      await recordUserActivity(
        auth.currentUser.uid,
        songid,
        name,
        details.primaryArtists || "Unknown Artist",
        "unliked",
        image
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlike song");
      setLiked(true);
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
          {/* Desktop */}
          {isAboveMedium ? (
            <div className="w-full max-w-3xl mx-auto mt-10 bg-gradient-to-br from-deep-grey/80 to-deep-blue/80 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-8">
                <img src={image} alt="song" className="h-48 w-48 rounded-xl object-cover shadow-lg" />
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{songName}</h1>
                  <div className="flex gap-4 mb-4">
                    {!dloading ? (
                      <>
                        {liked ? (
                          <button onClick={handleDelete} className="focus:outline-none">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/16887/16887092.png"
                              className="h-10"
                              alt="Unlike"
                            />
                          </button>
                        ) : (
                          <button onClick={handleLikes} className="focus:outline-none">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/3641/3641323.png"
                              className="h-10"
                              alt="Like"
                            />
                          </button>
                        )}
                        <button
                          onClick={downloadAudio}
                          className="focus:outline-none relative"
                          disabled={dloading}
                        >
                          {dloading ? (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <img
                                src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                                className="animate-spin h-8 w-8"
                                alt="Loading"
                              />
                            </span>
                          ) : (
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/2810/2810387.png"
                              className="h-8"
                              alt="Download"
                            />
                          )}
                        </button>
                      </>
                    ) : (
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                        className="animate-spin h-10"
                        alt="Loading"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                        midsection === "song"
                          ? "bg-melody-pink-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-melody-pink-700"
                      }`}
                      onClick={() => setMidsection("song")}
                    >
                      Recommendations
                    </button>
                    <button
                      className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                        midsection === "lyric"
                          ? "bg-melody-pink-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-melody-pink-700"
                      }`}
                      onClick={() => setMidsection("lyric")}
                    >
                      Lyrics & Info
                    </button>
                  </div>
                </div>
              </div>
              {midsection === "song" && (
                <div className="mt-8 space-y-4">
                  {recommendation.map((song, index) => (
                    <div
                      className="bg-melody-purple-800 flex items-center p-4 rounded-lg border border-melody-purple-700 hover:border-melody-pink-600/50 hover:shadow-melody-pink-600/30 hover:shadow-md transition-all duration-300"
                      key={index}
                      onClick={() => play(song.song)}
                    >
                      <span className="text-sm w-12 text-gray-400 text-center font-medium">#{index + 1}</span>
                      <div className="flex flex-col flex-grow ml-4 gap-1">
                        <span className="text-md font-bold text-white">{song.song}</span>
                        <span className="text-xs font-semibold text-gray-400">
                          {song.artist}
                          {song.movie && <span className="font-normal"> ~ {song.movie}</span>}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {midsection === "lyric" && (
                <div className="mt-8">
                  <div className="bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <span className="text-xs text-gray-400">Title</span>
                        <div className="text-white font-medium">{he.decode(details.name)}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Release Year</span>
                        <div className="text-white font-medium">{details.year}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Album</span>
                        <div className="text-white font-medium">{details.album && he.decode(details.album.name)}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Language</span>
                        <div className="text-white font-medium">{details.language}</div>
                      </div>
                    </div>
                    <div className="bg-deep-grey/50 rounded-lg p-4 mt-2 max-h-96 overflow-y-auto custom-scrollbar">
                      <div className="text-md whitespace-pre-line text-gray-200">
                        {lyrics ? lyrics : (
                          <div className="flex flex-col items-center py-6 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Lyrics not found for this song</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Spacer for audio player */}
              <div className="h-32"></div>
            </div>
          ) : (
            // Mobile
            <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-deep-grey/80 to-deep-blue/80 rounded-2xl shadow-2xl p-4 pb-32 min-h-screen overflow-y-auto">
              <div className="flex flex-col items-center">
                <div className="border-1 bg-melody-purple-800 border border-melody-purple-700 rounded-xl w-40 h-40 mb-4 flex items-center justify-center shadow-lg">
                  <img src={image} alt="song" className="h-36 w-36 rounded-lg object-cover" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{songName}</h1>
                <div className="flex flex-row items-center gap-4 mb-4">
                  {!dloading ? (
                    <>
                      {liked ? (
                        <button onClick={handleDelete} className="focus:outline-none">
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/16887/16887092.png"
                            className="h-8"
                            alt="Unlike"
                          />
                        </button>
                      ) : (
                        <button onClick={handleLikes} className="focus:outline-none">
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/3641/3641323.png"
                            className="h-8"
                            alt="Like"
                          />
                        </button>
                      )}
                      <button
                        onClick={downloadAudio}
                        className="focus:outline-none relative"
                        disabled={dloading}
                      >
                        {dloading ? (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                              className="animate-spin h-8 w-8"
                              alt="Loading"
                            />
                          </span>
                        ) : (
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/2810/2810387.png"
                            className="h-8"
                            alt="Download"
                          />
                        )}
                      </button>
                    </>
                  ) : (
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/1665/1665733.png"
                      className="animate-spin h-8"
                      alt="Loading"
                    />
                  )}
                </div>
                <div className="flex w-full bg-gradient-to-br from-deep-grey to-deep-blue rounded-lg overflow-hidden border border-gray-700 mb-6 shadow-md">
                  <button
                    className={`flex-1 py-3 px-4 font-semibold transition-all duration-300 ${
                      midsection === "song"
                        ? "bg-melody-pink-500 text-white"
                        : "text-gray-400 hover:bg-deep-grey/60"
                    }`}
                    onClick={() => setMidsection("song")}
                  >
                    Recommendations
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 font-semibold transition-all duration-300 ${
                      midsection === "lyric"
                        ? "bg-melody-pink-500 text-white"
                        : "text-gray-400 hover:bg-deep-grey/60"
                    }`}
                    onClick={() => setMidsection("lyric")}
                  >
                    Lyrics & Info
                  </button>
                </div>
                {midsection === "song" && (
                  <div className="mb-36 w-full">
                    {recommendation.map((song, index) => (
                      <div
                        className="bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 hover:border-melody-pink-500/50 flex items-center p-4 m-2 cursor-pointer rounded-lg shadow-md hover:shadow-melody-pink-500/20 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
                        key={index}
                        onClick={() => play(song.song)}
                      >
                        <div className="text-sm w-8 text-gray-400 text-center font-medium">#{index + 1}</div>
                        <div className="flex-grow px-4">
                          <h3 className="text-white font-medium mb-1">{song.song}</h3>
                          <div className="flex items-center text-xs text-gray-400">
                            <span className="font-medium text-melody-pink-400">{song.artist}</span>
                            {song.movie && (
                              <>
                                <span className="mx-1.5">•</span>
                                <span>{song.movie}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="p-2 rounded-full bg-melody-pink-500/20 text-melody-pink-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {midsection === "lyric" && (
                  <div className="mb-36 w-full px-2">
                    <div className="bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 p-6 m-2 rounded-lg shadow-md">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <span className="text-xs text-gray-400">Title</span>
                          <div className="text-white font-medium">{he.decode(details.name)}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Release Year</span>
                          <div className="text-white font-medium">{details.year}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Album</span>
                          <div className="text-white font-medium">{details.album && he.decode(details.album.name)}</div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Language</span>
                          <div className="text-white font-medium">{details.language}</div>
                        </div>
                      </div>
                      <div className="bg-deep-grey/50 rounded-lg p-4 mt-2 max-h-96 overflow-y-auto custom-scrollbar">
                        <div className="text-md whitespace-pre-line text-gray-200">
                          {lyrics ? lyrics : (
                            <div className="flex flex-col items-center py-6 text-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Lyrics not found for this song</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Spacer for audio player */}
                <div className="h-32"></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-deep-grey/80 to-deep-blue/80">
          <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-deep-grey/80 to-deep-blue/80 rounded-2xl shadow-2xl p-6 animate-pulse">
            {/* Image skeleton */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-700 rounded-xl w-40 h-40 mb-4"></div>
              {/* Title skeleton */}
              <div className="h-6 w-2/3 bg-gray-700 rounded mb-4"></div>
              {/* Buttons skeleton */}
              <div className="flex flex-row gap-4 mb-4 w-full justify-center">
                <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
              </div>
              {/* Tabs skeleton */}
              <div className="flex w-full gap-2 mb-6">
                <div className="flex-1 h-10 bg-gray-700 rounded-full"></div>
                <div className="flex-1 h-10 bg-gray-700 rounded-full"></div>
              </div>
              {/* Content skeleton */}
              <div className="w-full space-y-4">
                <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto"></div>
                <div className="h-6 bg-gray-700 rounded w-2/3 mx-auto"></div>
                <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto"></div>
                <div className="h-6 bg-gray-700 rounded w-5/6 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Innersongs;
