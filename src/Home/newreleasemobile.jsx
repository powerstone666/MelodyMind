import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context.js";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";
import { addRecents } from "../Firebase/database";
import { Card, CardInfo, AlbumArt, Loader, EmptyState } from '../components/UI';

function Newreleasemobile({ names }) { // MobileNewReleases component
  const { setSongid, Viewall, page } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await MelodyMusicsongs(names);
        if (res) {          setMusicInfo(
            res.map((song) => ({
              id: song.id,
              name: he.decode(song.name),
              image: song.image[2] ? song.image[2] : song.image[1],
            }))
          );
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
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
    <>
      {loading ? (
        <Loader />
      ) : musicInfo.length === 0 ? (
        <EmptyState 
          message="No new releases available" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          } 
        />
      ) : (        <div className="flex overflow-x-auto overflow-y-hidden space-x-4 p-2 pb-4 no-scrollbar snap-x snap-mandatory w-full">
          {musicInfo.map((song) => (
            <div
              key={song.id}
              onClick={() => play(song.id, song.name, song.image.url)}              className="bg-melody-purple-800 rounded-lg overflow-hidden min-w-[130px] max-w-[130px] md:min-w-[160px] md:max-w-[160px] lg:min-w-[180px] lg:max-w-[180px] xl:min-w-[190px] xl:max-w-[190px]
              transition-all duration-300 hover:scale-102 cursor-pointer snap-start
              border border-melody-purple-700 hover:border-melody-pink-600/50"
            >
              <AlbumArt src={song.image.url} alt={song.name} />
              <CardInfo title={song.name} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Newreleasemobile;
