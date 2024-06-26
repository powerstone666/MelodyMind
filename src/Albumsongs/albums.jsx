import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import useMediaQuery from "../useMedia";
import { albumsongs } from "../saavnapi";
import { Link } from "react-router-dom";
import he from "he";

function Albums() {
  const { setSongid, setInneralbum, setSelected, page, Viewall } = useContext(
    Context
  );
  const [limit, setLimit] = useState(5);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const isAboveMedium = useMediaQuery("(min-width:1025px)");

  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await albumsongs();
        setMusicInfo(
          res.data.data.results.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            artist: song.artists.primary[0].name,
            image: song.image[1].url,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const play = async (id) => {
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);

    localStorage.setItem("selected", "/albums");
    setSelected("/albums");
  };

  return (
    <>
      {!loading ? (
        isAboveMedium ? (
          <div className="flex p-4 flex-3 gap-5 mb-8 cursor-pointer">
            <div className="flex flex-wrap">
              {musicInfo.slice(0, limit).map((song) => (
            <Link to="/innerAlbum">  <div
                  className="h-68 border-1 bg-deep-grey w-56 text-white mr-5 border-0 rounded-md p-4 mt-5"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <img
                    src={song.image}
                    alt={song.name}
                    className="h-48 w-56 object-cover border-0 rounded-md"
                  />
                  <h1 className="text-center font-bold text-white">
                    {song.name}
                  </h1>
                </div>
                </Link>
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
        ) : (
          <div className="flex p-4  overflow-x-scroll overflow-y-hidden">
            {musicInfo
              .slice(0,musicInfo.length)
              .map((song) => (
                <Link to="/innerAlbum">
                <div
                  className="flex flex-col items-center pb-4"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <div className="h-28 p-2 border-1 bg-deep-grey w-28 text-white mr-8 border-0 rounded-md mt-2">
                    <img
                      src={song.image}
                      alt={song.name}
                      className="h-24 w-24 mb-2 object-cover border-0 rounded-md"
                    />
                    <p className="text-center font-bold text-white text-sm truncate">
                      {song.name}
                    </p>
                  </div>
                </div>
                </Link>
              ))}
          </div>
        )
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </>
  );
}

export default Albums;
