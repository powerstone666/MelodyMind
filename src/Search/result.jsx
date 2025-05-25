import React, { useContext } from "react";
import { FaMusic, FaCompactDisc, FaUserAlt, FaSearch } from "react-icons/fa";

import { addRecents } from "../Firebase/database";
import { useState, useEffect } from "react";
import { Context } from "../context.js"; // Updated import
import useMediaQuery from "../useMedia";
import { MelodyMusicsongs, Searchsongs3, Searchsongs2 } from "../saavnapi";
import he from "he";
import { Link, useNavigate } from "react-router-dom";
function Result({ names }) {
  const { setSongid, setSelected, setSinger, setInneralbum } =
    useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const [topquery, setTopquery] = useState([]);
  const [albuminfo, setAlbuminfo] = useState([]);
  const [artistinfo, setArtistinfo] = useState([]);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Searchsongs3(names);
        const res2 = await Searchsongs2(names);
        setMusicInfo(
          res2.results.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[2] ? song.image[2].url : song.image[1].url,
          }))
        );
        setAlbuminfo(
          res.albums.results.map((song) => ({
            id: song.id,
            name: he.decode(song.title),
            image: song.image[2] ? song.image[2].url : song.image[1].url,
          }))
        );
        setArtistinfo(
          res.artists.results.map((song) => ({
            id: song.id,
            name: he.decode(song.title),
            image: song.image[2] ? song.image[2].url : song.image[1].url,
          }))
        );
        setTopquery(
          res.topQuery.results.map((song) => ({
            id: song.id,
            name: he.decode(song.title),
            image: song.image[2] ? song.image[2].url : song.image[1].url,
            type: song.type,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [names]);

  const play = async (id, name, image) => {
    localStorage.setItem("songid", id);
    setSongid(id);

    const user = JSON.parse(localStorage.getItem("Users"));

    if (user) {
      try {
        await addRecents(user.uid, id, name, image);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const playsinger = (id) => {
    localStorage.setItem("singer", id);
    setSinger(id);

    localStorage.setItem("selected", "/artist");
    setSelected("/artist");
  };
  const playalbum = async (id) => {
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);

    localStorage.setItem("selected", "/albums");
    setSelected("/albums");
  };
  const playquery = async (id) => {
    switch (topquery[0].type) {
      case "album":
        localStorage.setItem("innerAlbum", id);
        setInneralbum(id);
        localStorage.setItem("selected", "albums");
        setSelected("albums");
        Navigate("/innerAlbum");
        break;
      case "artist":
        localStorage.setItem("singer", id);
        setSinger(id);

        localStorage.setItem("selected", "artist");
        setSelected("artist");
        Navigate("/innerartist");
        break;
      case "song":
        localStorage.setItem("songid", id);
        setSongid(id);
        break;
    }
  };

  // Check if all results are empty (no results found)
  const noResults =
    !loading &&
    musicInfo.length === 0 &&
    albuminfo.length === 0 &&
    artistinfo.length === 0 &&
    topquery.length === 0 &&
    names;

  if (!names) {
    // Default search page (no query entered)
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#1e2746] via-[#232946] to-[#2d3250] pb-16 flex flex-col items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 md:px-0 w-full">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-2xl flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg text-center">
              Search MelodyMind
            </h1>
            <p className="text-lg text-white/80 font-medium mb-2 text-center">
              Find your favorite songs, albums, and artists instantly.
            </p>
          </div>
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#ff6b81]/40 to-[#232946]/0 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tr from-[#6b81ff]/40 to-[#232946]/0 rounded-full blur-2xl -z-10" />
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-xl w-full">
            <FaSearch className="w-16 h-16 text-[#ff6b81] mb-4 animate-bounce-slow" />
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Start your search
            </h2>
            <p className="text-white/70 text-center mb-2">
              Type a song, album, or artist in the search bar above to discover
              music on MelodyMind.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (noResults) {
    // No results found UI
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#1e2746] via-[#232946] to-[#2d3250] pb-16 flex flex-col items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 md:px-0 w-full">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-2xl flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg text-center">
              No Results Found
            </h1>
            <p className="text-lg text-white/80 font-medium mb-2 text-center">
              Sorry, we couldn't find anything for{" "}
              <span className="text-[#ff6b81] font-bold">"{names}"</span>.
            </p>
          </div>
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#ff6b81]/40 to-[#232946]/0 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tr from-[#6b81ff]/40 to-[#232946]/0 rounded-full blur-2xl -z-10" />
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-xl w-full">
            <FaSearch className="w-16 h-16 text-[#ff6b81] mb-4 animate-bounce-slow" />
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Try another search
            </h2>
            <p className="text-white/70 text-center mb-2">
              Check your spelling or try a different keyword.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1e2746] via-[#232946] to-[#2d3250] pb-56">
      {/* Hero Banner */}
      <div className="relative z-10 flex flex-col items-center justify-center  px-4 md:px-0">
       
        {/* Decorative gradient shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#ff6b81]/40 to-[#232946]/0 rounded-full blur-2xl -z-10" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tr from-[#6b81ff]/40 to-[#232946]/0 rounded-full blur-2xl -z-10" />
      </div>
      {!loading && (
        <div className="flex flex-col gap-10 px-2 md:px-10">
          {/* Songs Section */}
          {musicInfo.length > 0 && (
            <div className="rounded-3xl bg-white/10 backdrop-blur-md shadow-xl p-6 md:p-8 mb-2 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gradient-to-tr from-[#ff6b81] to-[#ffb86b] p-3 rounded-full text-white text-2xl shadow-lg">
                  <FaMusic />
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Songs
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {musicInfo.slice(0, 12).map((song) => (
                  <div
                    key={song.id}
                    className="group bg-gradient-to-br from-[#232946]/60 to-[#ff6b81]/10 rounded-2xl p-3 flex flex-col items-center shadow-md hover:scale-105 hover:shadow-2xl transition-all cursor-pointer border border-white/10"
                    onClick={() => play(song.id, song.name, song.image)}
                  >
                    <img
                      src={song.image}
                      alt={song.name}
                      className="h-28 w-28 object-cover rounded-xl mb-2 border-2 border-white/20 group-hover:border-[#ff6b81] transition-all"
                    />
                    <h3 className="text-white font-semibold text-center truncate w-full">
                      {song.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Albums Section */}
          {albuminfo.length > 0 && (
            <div className="rounded-3xl bg-white/10 backdrop-blur-md shadow-xl p-6 md:p-8 mb-2 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gradient-to-tr from-[#6b81ff] to-[#81ffb6] p-3 rounded-full text-white text-2xl shadow-lg">
                  <FaCompactDisc />
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Albums
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {albuminfo.slice(0, 8).map((album) => (
                  <Link to="/innerAlbum" key={album.id}>
                    <div
                      className="group bg-gradient-to-br from-[#232946]/60 to-[#6b81ff]/10 rounded-2xl p-3 flex flex-col items-center shadow-md hover:scale-105 hover:shadow-2xl transition-all cursor-pointer border border-white/10"
                      onClick={() => playalbum(album.id)}
                    >
                      <img
                        src={album.image}
                        alt={album.name}
                        className="h-28 w-28 object-cover rounded-xl mb-2 border-2 border-white/20 group-hover:border-[#6b81ff] transition-all"
                      />
                      <h3 className="text-white font-semibold text-center truncate w-full">
                        {album.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* Artists Section */}
          {artistinfo.length > 0 && (
            <div className="rounded-3xl bg-white/10 backdrop-blur-md shadow-xl p-6 md:p-8 mb-2 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gradient-to-tr from-[#81ffb6] to-[#ffb86b] p-3 rounded-full text-white text-2xl shadow-lg">
                  <FaUserAlt />
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Artists
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {artistinfo.slice(0, 8).map((artist) => (
                  <Link to="/innerartist" key={artist.id}>
                    <div
                      className="group bg-gradient-to-br from-[#232946]/60 to-[#81ffb6]/10 rounded-2xl p-3 flex flex-col items-center shadow-md hover:scale-105 hover:shadow-2xl transition-all cursor-pointer border border-white/10"
                      onClick={() => playsinger(artist.id)}
                    >
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="h-28 w-28 object-cover rounded-full mb-2 border-2 border-white/20 group-hover:border-[#81ffb6] transition-all"
                      />
                      <h3 className="text-white font-semibold text-center truncate w-full">
                        {artist.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* Top Query Section */}
          {topquery.length > 0 && (
            <div className="rounded-3xl bg-white/10 backdrop-blur-md shadow-xl p-6 md:p-8 mb-2 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gradient-to-tr from-[#ffb86b] to-[#ff6b81] p-3 rounded-full text-white text-2xl shadow-lg">
                  <FaSearch />
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Top Results</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {topquery.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="group bg-gradient-to-br from-[#232946]/60 to-[#ffb86b]/10 rounded-2xl p-3 flex flex-col items-center shadow-md hover:scale-105 hover:shadow-2xl transition-all cursor-pointer border border-white/10"
                    onClick={() => playquery(item.id)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-28 w-28 object-cover rounded-xl mb-2 border-2 border-white/20 group-hover:border-[#ffb86b] transition-all"
                    />
                    <h3 className="text-white font-semibold text-center truncate w-full">{item.name}</h3>
                    <span className="text-xs text-white/60 mt-1 capitalize">{item.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <span className="text-[#ff6b81] text-3xl font-bold animate-pulse">
            Loading...
          </span>
        </div>
      )}
    </div>
  );
}

export default Result;
