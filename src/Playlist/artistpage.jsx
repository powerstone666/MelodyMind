import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { artist } from "../saavnapi";

function ArtistPage({ names }) {
  const { setSongid,setSelected } = useContext(Context);
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
    setSongid(id);
  };

  return (
    <>
    {isAboveMedium ?(
    <div
    className="overflow-y-auto h-screen w-screen mb-12"
    style={{ overflowX: "scroll", minWidth: "100%" }}
  >
    <div className="flex p-4 flex-3 gap-5 mb-12 cursor-pointer " >
      {!loading ? (
        <div className="flex flex-wrap">
          
            <>
              {musicInfo.slice(0, musicInfo.length).map((song) => (
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
            
            </>
        </div>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
      <div className="h-2/6"> 

      </div>
      </div>
    </div>
    ):(
      setSelected("home")
    )}
    </>
  );
}

export default ArtistPage;
