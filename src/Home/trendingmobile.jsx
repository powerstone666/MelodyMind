import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";
function Trendingmobile({ names }) {
  const { setSongid } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [loading, setLoading] = useState(true);
  const {Viewall,page}=useContext(Context);
  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await MelodyMusicsongs(names);
        if (res) {
          setMusicInfo(
            res.map((song) => ({
              id: song.id,
              name: he.decode(song.name),
              image: song.image[1],
            }))
          );
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [names]);

  const play = (id) => {
    const a = localStorage.setItem("songid", id);
    setSongid(id);
  };

  return (
    <div className="flex p-4 flex-3 gap-5 mb-4 cursor-pointer ">
      {!loading ? (
        <>
          <div className="flex flex-wrap">
           <>
            {
            musicInfo.slice(0, page==="trending"?Viewall:3).map((song) => (
              <div
                className="flex flex-col items-center pb-12"
                key={song.id}
                onClick={() => play(song.id)}
              >
                <div className="h-28 p-2 border-1 bg-deep-grey w-24 text-white mr-5 border-0 rounded-md  mt-2">
                  <img
                    src={song.image.url}
                    alt={song.title}
                    className="h-24 w-24 object-cover border-0 rounded-md mb-2"
                  />
                   <p className="text-center font-bold text-white text-sm">
                    {song.name}
                  </p>
                </div>
              </div>
            ))
              }</>
         </div>
      </>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </div>
  );
}

export default Trendingmobile;
