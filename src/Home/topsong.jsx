import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";

function Topsongs({ names }) {
  const { setSongid } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = useState(true);
  const { Viewall, page } = useContext(Context);

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
              image: song.image[1].url, // Assuming image is an array and you need the second element
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
    localStorage.setItem("songid", id);
    setSongid(id);
  };

  return (
    <>
      {!loading ? (
        <>
          {isAboveMedium ? (
            <div className="flex p-4 flex-3 gap-5 mb-4 cursor-pointer">
              {musicInfo.slice(0, limit).map((song) => (
                <div
                  className="h-68 border-1 bg-deep-grey w-56 text-white mr-5 border-0 rounded-md p-4 mt-5"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <img
                    src={song.image} // Assuming song.image is an object with a 'url' property
                    alt={song.name}
                    className="h-48 w-56 object-cover border-0 rounded-md"
                  />
                  <h1 className="text-center font-bold text-white">
                    {song.name}
                  </h1>
                </div>
              ))}
              {musicInfo.length > 5 && limit === 5 ? (
                <button onClick={expandResults}>
                  <img src={viewall} alt="View All" />
                  <h1 className="font-bold">View All</h1>
                </button>
              ) : (
                <button onClick={() => setLimit(5)}>
                  <img src={viewclose} alt="Close" />
                  <h1 className="font-bold">Close</h1>
                </button>
              )}
            </div>
          ) : (
           
      <div className="flex overflow-x-scroll overflow-y-hidden space-x-4 p-2">
        {musicInfo.map((song) => (
          <div
            className="flex flex-col items-center pb-6"
            key={song.id}
            onClick={() => play(song.id)}
          >
            <div className="h-28 border-1 p-2 bg-deep-grey w-28 text-white border-0 rounded-md mt-2">
              <img
                src={song.image}
                alt={song.name}
                className="h-24 w-24 object-cover mb-2 rounded-md"
              />
              <h1 className="text-center font-bold text-white text-sm truncate">
                {song.name}
              </h1>
            </div>
          </div>
        ))}
      </div>

          )}
        </>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </>
  );
}

export default Topsongs;
