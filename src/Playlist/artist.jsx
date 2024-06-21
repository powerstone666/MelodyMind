import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { artist } from "../saavnapi";

function Artist({ names }) {
  const { setSinger,page,Viewall,setSelected } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [loading, setLoading] = useState(true);
  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res=await artist();

        setMusicInfo(
          res.data.data.results.map((song) => ({
            id: song.id,
            name: song.name,
            image: song.image[1],
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
    localStorage.setItem("singer", id);
    setSinger(id);
    
    localStorage.setItem("selected", "innerartist");
           setSelected("innerartist");
  };

  return (
    <div className="flex p-4 flex-3 gap-5 mb-4 cursor-pointer">
      {!loading ? (
        <div className="flex flex-wrap">
          {isAboveMedium ? (
            <>
              {musicInfo.slice(0, limit).map((song) => (
                <div
                  className="h-68 border-1 bg-transparent w-56 text-white mr-5 border-0 rounded-md p-4 mt-5"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <img
                    src={song.image.url}
                    alt={song.title}
                    className="h-48 w-56 object-cover border-0 rounded-full"
                  />
                  <h1 className="text-center font-bold text-white">
                    {song.name}
                  </h1>
                </div>
              ))}
              {musicInfo.length > 5 && limit === 5 ? (
                <button onClick={expandResults}>
                  <img src={viewall}  />
                  <h1 className="font-bold"> View All</h1>
                </button>
              ) : (
                <button onClick={() => setLimit(5)}>
                  <img src={viewclose} />
                  <h1 className="font-bold">Close</h1>
                </button>
              )}
            </>
          ) : (
            musicInfo.slice(0, page==="artist"?Viewall:3).map((song) => (
              <div
                className="flex flex-col items-center pb-4"
                key={song.id}
                onClick={() => play(song.id)}
              >
                <div className="h-24 border-1 bg-transparent w-20 text-white mr-8 border-0 rounded-md  mt-2">
                  <img
                    src={song.image.url}
                    alt={song.title}
                    className="h-20 w-20 object-cover border-0 rounded-full"
                  />
                    <p className="text-center font-bold text-white text-sm">
                    {song.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </div>
  );
}

export default Artist;
