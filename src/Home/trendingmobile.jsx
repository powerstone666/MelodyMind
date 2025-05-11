import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context.js"; // Updated import
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";
import { addRecents } from '../Firebase/database';
import { Card, AlbumArt, CardInfo } from '../components/UI';

function Trendingmobile({ names }) { // MobileDiscovery component
  const { setSongid } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const { page } = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await MelodyMusicsongs(names);
        if (res) {          setMusicInfo(
            res.map((song) => ({
              id: song.id,
              name: he.decode(song.name),
              image: song.image[2] ? song.image[2].url : song.image[1].url, // Now using image[2] with fallback to image[1]
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
    }  };
    return (
    <>
      {!loading ? (        <div className="flex overflow-x-auto overflow-y-hidden space-x-4 p-2 pb-4 no-scrollbar snap-x snap-mandatory w-full">
          {musicInfo.map((song) => (
            <div
              key={song.id}
              onClick={() => play(song.id, song.name, song.image)}              className="bg-melody-purple-800 rounded-lg overflow-hidden min-w-[130px] max-w-[130px] md:min-w-[160px] md:max-w-[160px] lg:min-w-[180px] lg:max-w-[180px] xl:min-w-[190px] xl:max-w-[190px]
              transition-all duration-300 hover:scale-102 cursor-pointer snap-start
              border border-melody-purple-700 hover:border-melody-pink-600/50"
            >
              <AlbumArt src={song.image} alt={song.name} />
              <CardInfo title={song.name} />
            </div>
          ))}
        </div>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>      )}
    </>
  );
}

export default Trendingmobile;
