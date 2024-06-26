import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { MelodyMusicsongs, Searchsongs, Searchsongs2 } from "../saavnapi";
import he from "he";
import { Link, useNavigate } from "react-router-dom";
function Result({ names }) {
  const { setSongid,setSelected,setSinger,setInneralbum } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const [topquery, setTopquery] = useState([]);
  const [albuminfo, setAlbuminfo] = useState([]);
  const [artistinfo, setArtistinfo] = useState([]);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [loading, setLoading] = useState(true);
  const Navigate=useNavigate();
  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Searchsongs(names);
        const res2=await Searchsongs2(names);
        setMusicInfo(
          res2.results.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1].url,
          }))
        );
        setAlbuminfo(
          res.albums.results.map((song) => ({
            id: song.id,
            name: he.decode(song.title),
            image: song.image[1].url,
          }))
        );
        setArtistinfo(
          res.artists.results.map((song) => ({
            id: song.id,
            name: he.decode(song.title),
            image: song.image[1].url,
          }))
        );
        setTopquery(
          res.topQuery.results.map((song) => ({
            id: song.id,
            name: he.decode(song.title),
            image: song.image[1].url,
            type:song.type
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    

    fetchData();
  }, [names]);

  const play = (id) => {
    localStorage.setItem("songid", id);
    setSongid(id);
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

  switch(topquery[0].type){
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

  return (
    <div className=" p-4  gap-5 mb-12 cursor-pointer ">
      {!loading ? (
        <>
       
          {isAboveMedium ? (
            <>
            
            <h1 className="text-2xl p-2 m-2">
            Top <span className="text-red font-bold">Songs</span>
            </h1>
             <div className="flex flex-wrap p-4  gap-5">
              {musicInfo.slice(0, musicInfo.length).map((song) => (
                <div
                  className="h-68 border-1 bg-deep-grey w-56 text-white mr-5 border-0 rounded-md p-4 mt-5"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <img
                    src={song.image}
                    alt={song.title}
                    className="h-48 w-56 object-cover border-0 rounded-md"
                  />
                  <h1 className="text-center font-bold text-white">
                    {song.name}
                  </h1>
                </div>
              ))}
              </div>

             <h1 className="text-2xl p-2 m-2">
            Top <span className="text-red font-bold">Albums</span>
            </h1>
           
            <div className="flex flex-wrap p-4  gap-5">
              {albuminfo.slice(0, limit).map((song) => (
                  <Link to="/innerAlbum">
                <div
                  className="h-68 border-1 bg-deep-grey w-56 text-white mr-5  rounded-md p-4 mt-5"
                  key={song.id}
                  onClick={() => playalbum(song.id)}
                >
                  <img
                    src={song.image}
                    alt={song.title}
                    className="h-48 w-56 object-cover border-0 rounded-md"
                  />
                  <h1 className="text-center font-bold text-white">
                    {song.name}
                  </h1>
                </div>
                </Link>
              ))}
              </div>
              <h1 className="text-2xl p-2 m-2">
            Top <span className="text-red font-bold">Artist</span>
            </h1>
            <div className="flex flex-wrap p-4  gap-5">
              {artistinfo.slice(0, limit).map((song) => (
                  <Link to="/innerartist">
                <div
                  className="h-68 border-1 bg-transparent w-56 text-white mr-5 border-0 rounded-md  p-4 mt-5"
                  key={song.id}
                  onClick={() => playsinger(song.id)}
                >
                  <img
                    src={song.image}
                    alt={song.title}
                    className="h-48 w-56 object-cover border-0 rounded-full" 
                  />
                  <h1 className="text-center font-bold text-white">
                    {song.name}
                  </h1>
                </div>
                </Link>
              ))}
              </div>
              <h1 className="text-2xl p-2 m-2">
            Top <span className="text-red font-bold">Query</span>
            </h1>
            <div className="flex flex-wrap p-4 mb-8 gap-5">
              {topquery.slice(0, limit).map((song) => (
                <div
                  className="h-68 border-1 bg-deep-grey w-56 text-white mr-5  rounded-md p-4 mt-5"
                  key={song.id}
                  onClick={() => playquery(song.id)}
                >
                  <img
                    src={song.image}
                    alt={song.title}
                    className="h-48 w-56 object-cover border-0 rounded-md" 
                  />
                  <h1 className="text-center font-bold text-white">
                    {song.name}
                  </h1>
                </div>
              ))}
              </div>
            </>
          ) : (
           <>
           <h1 className="text-2xl p-2 m-2">
  Top <span className="text-red font-bold">Songs</span>
</h1>
<div className="flex overflow-x-scroll overflow-y-hidden space-x-4 p-2">
  {musicInfo.slice(0, 10).map((song) => (
    <div
      className="flex flex-col items-center pb-4"
      key={song.id}
      onClick={() => play(song.id)}
    >
      <div className="h-28 p-2 border-1 bg-deep-grey w-28 text-white rounded-md mt-2">
        <img
          src={song.image}
          alt={song.name}
          className="h-24 w-24 mb-2 object-cover "
        />
        <h1 className="text-center font-bold text-white text-sm truncate">
          {song.name}
        </h1>
      </div>
    </div>
  ))}
</div>

<h1 className="text-2xl p-2 mt-5">
  Top <span className="text-red font-bold">Albums</span>
</h1>
<div className="flex overflow-x-scroll overflow-y-hidden space-x-4 p-2">
  {albuminfo.slice(0, 10).map((album) => (
      <Link to="/innerAlbum">
    <div
      className="flex flex-col items-center pb-4"
      key={album.id}
      onClick={() => playalbum(album.id)}
    >
      <div className="h-28 p-2 border-1 bg-deep-grey w-28 text-white rounded-md mt-2">
        <img
          src={album.image}
          alt={album.name}
          className="h-24 w-24 mb-2 object-cover"
        />
        <h1 className="text-center font-bold text-white text-sm truncate">
          {album.name}
        </h1>
      </div>
    </div>
    </Link>
  ))}
</div>

<h1 className="text-2xl p-2 mt-5">
  Top <span className="text-red font-bold">Artists</span>
</h1>
<div className="flex overflow-x-scroll overflow-y-hidden space-x-4 p-2">
  {artistinfo.slice(0, 10).map((artist) => (
      <Link to="/innerartist">
    <div
      className="flex flex-col items-center pb-4"
      key={artist.id}
      onClick={() => playsinger(artist.id)}
    >
      <div className="h-28 p-2 border-1 bg-deep-grey w-28 text-white rounded-md mt-2">
        <img
          src={artist.image}
          alt={artist.name}
          className="h-24 w-24 mb-2 object-cover "
        />
        <h1 className="text-center font-bold text-white text-sm truncate">
          {artist.name}
        </h1>
      </div>
    </div>
    </Link>
  ))}
</div>

<h1 className="text-2xl p-2 mt-5">
  Top <span className="text-red font-bold">Query</span>
</h1>
<div className="flex overflow-x-scroll overflow-y-hidden space-x-4 p-2">
  {topquery.slice(0, 10).map((query) => (
    <div
      className="flex flex-col items-center pb-4"
      key={query.id}
      onClick={() => playquery(query.id)}
    >
      <div className="h-28 p-2 border-1 bg-deep-grey w-28 text-white rounded-md mt-2">
        <img
          src={query.image}
          alt={query.name}
          className="h-24 w-24 mb-2 object-cover "
        />
        <h1 className="text-center font-bold text-white text-sm truncate">
          {query.name}
        </h1>
      </div>
    </div>
  ))}
</div>

            </>
            )}
   
        </>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </div>
  
  );
}

export default Result;
