import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { artist } from "../saavnapi";

function Artist({ names }) {
  const { setSinger, page, Viewall, setSelected } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const isAboveMedium = useMediaQuery("(min-width:1025px)");
  const [loading, setLoading] = useState(true);

  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artist(); // Assuming artist() is a function that fetches artist data

        if (res.data && res.data.data && res.data.data.results) {
          setMusicInfo(
            res.data.data.results.map((song) => ({
              id: song.id,
              name: song.name,
              image: song.image[1].url, // Adjust accordingly if image structure varies
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
    localStorage.setItem("singer", id);
    setSinger(id);

    localStorage.setItem("selected", "innerartist");
    setSelected("innerartist");
  };

  return (
    <>
      {!loading ? (
        // Wrap your conditional rendering in a container div or fragment
        <div>
          {isAboveMedium ? (
            <>
              <div className="flex p-4 flex-3 gap-5 mb-4 cursor-pointer">
                <div className="flex flex-wrap">
                  {musicInfo.slice(0, limit).map((song) => (
                    <div
                      className="h-68 border-1 bg-transparent w-56 text-white mr-5 border-0 rounded-md p-4 mt-5"
                      key={song.id}
                      onClick={() => play(song.id)}
                    >
                      {song.image ? (
                        <img
                          src={song.image}
                          alt={song.name}
                          className="h-48 w-56 object-cover border-0 rounded-full"
                        />
                      ) : (
                        <div className="h-48 w-56 flex items-center justify-center bg-gray-200 text-gray-400">
                          Image Not Available
                        </div>
                      )}
                      <h1 className="text-center font-bold text-white">
                        {song.name}
                      </h1>
                    </div>
                  ))}
                  {musicInfo.length > 5 && limit === 5 ? (
                    <button onClick={expandResults}>
                      <img src={viewall} alt="View All" />
                      <h1 className="font-bold"> View All</h1>
                    </button>
                  ) : (
                    <button onClick={() => setLimit(5)}>
                      <img src={viewclose} alt="Close" />
                      <h1 className="font-bold">Close</h1>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex p-4 overflow-x-scroll overflow-y-hidden space-x-4">
              {musicInfo.slice(0, musicInfo.length).map((song) => (
                <div
                  className="flex flex-col items-center pb-4"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <div className="h-28 border-1 bg-transparent w-28 text-white border-0 rounded-md mt-2">
                    {song.image ? (
                      <img
                        src={song.image}
                        alt={song.name}
                        className="h-24 w-24 object-cover rounded-full"
                      />
                    ) : (
                      <div className="h-20 w-20 flex items-center justify-center bg-gray-200 text-gray-400">
                        Image Not Available
                      </div>
                    )}
                    <p className="text-center font-bold text-white text-sm truncate">
                      {song.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </>
  );
}

export default Artist;
