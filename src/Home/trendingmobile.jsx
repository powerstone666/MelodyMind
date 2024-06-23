import React, { useContext, useState, useEffect } from "react";
import { Context } from "../main";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";

function Trendingmobile({ names }) {
  const { setSongid } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const { page } = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await MelodyMusicsongs(names);
        if (res) {
          setMusicInfo(
            res.map((song) => ({
              id: song.id,
              name: he.decode(song.name),
              image: song.image[1].url, // Assuming `song.image` is an object with a `url` property
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
    <div className="flex p-2 gap-4 overflow-x-scroll space-x-2 overflow-y-hidden">
      {!loading ? (
        <>
          {musicInfo.map((song) => (
            <div
              className="flex flex-col items-center pb-4"
              key={song.id}
              onClick={() => play(song.id)}
            >
              <div className="h-28 p-2 border-1 bg-deep-grey w-28 text-white border-0 rounded-md mt-2">
                <img
                  src={song.image}
                  alt={song.name}
                  className="h-24 w-24 object-cover mb-2 rounded-md"
                />
                <p className="text-center font-bold text-white text-sm truncate">
                  {song.name}
                </p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </div>
  );
}

export default Trendingmobile;
