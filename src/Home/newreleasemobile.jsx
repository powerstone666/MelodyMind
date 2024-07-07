import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";

import { addRecents } from "../Firebase/database";
function Newreleasemobile({ names }) {
  const { setSongid, Viewall, page } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2">
      {!loading ? (
        musicInfo.map((song) => (
          <div
            className="flex flex-col items-center pb-6"
            key={song.id}
            onClick={() => play(song.id, song.name, song.image.url)}
          >
            <div className="h-28 p-2 border-1 bg-deep-grey w-28 text-white mr-2 border-0 rounded-md mt-2">
              <img
                src={song.image.url}
                alt={song.title}
                className="h-24 w-24 mb-2 object-cover border-0 rounded-md"
              />
              <p className="text-center font-bold text-white text-sm truncate">
                {song.name}
              </p>
            </div>
          </div>
        ))
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </div>
  );
}

export default Newreleasemobile;
