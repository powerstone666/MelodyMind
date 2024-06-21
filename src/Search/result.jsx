import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { MelodyMusicsongs, Searchsongs, Searchsongs2 } from "../saavnapi";
import he from "he";
function Result({ names }) {
  const { setSongid,setSelected,setSinger,setInneralbum } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const [topquery, setTopquery] = useState([]);
  const [albuminfo, setAlbuminfo] = useState([]);
  const [artistinfo, setArtistinfo] = useState([]);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [loading, setLoading] = useState(true);

  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Searchsongs(names);
        console.log(res);
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
    
    localStorage.setItem("selected", "innerartist");
           setSelected("innerartist");
  };
  const playalbum = async (id) => {
  
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);

    localStorage.setItem("selected", "innerAlbum");
           setSelected("innerAlbum");
  };
  const playquery = async (id) => {
  
  switch(topquery[0].type){
    case "album":
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);
    localStorage.setItem("selected", "innerAlbum");
           setSelected("innerAlbum");
           break;
    case "artist":
      localStorage.setItem("singer", id);
      setSinger(id);
      
      localStorage.setItem("selected", "innerartist");
             setSelected("innerartist");
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
                <div
                  className="h-68 border-1 bg-deep-grey w-56 text-white mr-5 border-0 rounded-md p-4 mt-5"
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
              ))}
              </div>
              <h1 className="text-2xl p-2 m-2">
            Top <span className="text-red font-bold">Artist</span>
            </h1>
            <div className="flex flex-wrap p-4  gap-5">
              {artistinfo.slice(0, limit).map((song) => (
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
              ))}
              </div>
              <h1 className="text-2xl p-2 m-2">
            Top <span className="text-red font-bold">Query</span>
            </h1>
            <div className="flex flex-wrap p-4 mb-8 gap-5">
              {topquery.slice(0, limit).map((song) => (
                <div
                  className="h-68 border-1 bg-transparent w-56 text-white mr-5 border-0 rounded-md  p-4 mt-5"
                  key={song.id}
                  onClick={() => playquery(song.id)}
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
              ))}
              </div>
            </>
          ) : (
           <>
               <h1 className="text-xl p-2 m-2">
            Top <span className="text-red font-bold">Songs</span>
            </h1>
             <div className="flex flex-wrap">{
            musicInfo.slice(0, 10).map((song) => (
              <div
                className="flex flex-col-3 items-center p-4 mb-5"
                key={song.id}
                onClick={() => play(song.id)}
              >
                <div className="h-24 border-1  w-20 text-white mr-5  rounded-md  mt-2">
                  <img
                    src={song.image}
                    alt={song.name}
                    className="h-18 w-18 object-cover border-0 rounded-md"
                  />
                  <h1 className="text-center font-bold text-white text-sm">
                    {song.name}
                  </h1>
                </div>
              </div>
            ))}
            </div>
            <h1 className="text-xl p-2 mt-5">
            Top <span className="text-red font-bold">Albums</span>
            </h1>
             <div className="flex flex-wrap">{
            albuminfo.slice(0, 10).map((song) => (
              <div
                className="flex flex-col-3 items-center p-4 mb-5"
                key={song.id}
                onClick={() => playalbum(song.id)}
              >
                <div className="h-24 border-1 bg-transparent w-20 text-white mr-5 border-0 rounded-md  mt-2">
                  <img
                    src={song.image}
                    alt={song.name}
                    className="h-18 w-18 object-cover border-0 rounded-md"
                  />
                  <h1 className="text-center font-bold text-white text-sm">
                    {song.name}
                  </h1>
                </div>
              </div>
            ))}
            </div>

            <h1 className="text-xl p-2 mt-5">
            Top <span className="text-red font-bold">Artists</span>
            </h1>
             <div className="flex flex-wrap">{
            artistinfo.slice(0, 10).map((song) => (
              <div
                className="flex flex-col-3 items-center p-4 mb-5"
                key={song.id}
                onClick={() => playsinger(song.id)}
              >
                <div className="h-24 border-1 bg-transparent w-20 text-white mr-5 border-0 rounded-md  mt-2">
                  <img
                    src={song.image}
                    alt={song.name}
                    className="h-18 w-18 object-cover border-0 rounded-md"
                  />
                  <h1 className="text-center font-bold text-white text-sm">
                    {song.name}
                  </h1>
                </div>
              </div>
            ))}
            </div>
            <h1 className="text-xl p-2 mt-5">
            Top <span className="text-red font-bold">Query</span>
            </h1>
             <div className="flex flex-wrap">{
            topquery.slice(0, 10).map((song) => (
              <div
                className="flex flex-col-3 items-center p-4 "
                key={song.id}
                onClick={() => playquery(song.id)}
              >
                <div className="h-24 border-1 bg-transparent w-20 text-white mr-5 border-0 rounded-md  mt-2">
                  <img
                    src={song.image}
                    alt={song.name}
                    className="h-18 w-18 object-cover border-0 rounded-md"
                  />
                  <h1 className="text-center font-bold text-white text-sm">
                    {song.name}
                  </h1>
                </div>
              </div>
            ))}
            </div>
            </>
          )}{" "}
        
   
        </>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </div>
  
  );
}

export default Result;
