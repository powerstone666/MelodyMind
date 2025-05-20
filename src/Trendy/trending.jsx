import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context.js";
import useMediaQuery from "../useMedia";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";
import { Card, CardInfo, AlbumArt, Loader, EmptyState, Button, Section } from '../components/UI';

function Trending({ names }) {
  const { setSongid } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const [loading, setLoading] = useState(true);
  
  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };
  
  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await MelodyMusicsongs("topsongs");        setMusicInfo(
          res.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[2] ? song.image[2] : song.image[1],
            duration: formatDuration(song.duration),
            album: he.decode(song.album.name),
            year: song.year,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [names ? names : ""]);

  const play = (id) => {
    setSongid(id);
  };  return (
    <Section 
      title="Top Tracks" 
      onViewAll={musicInfo.length > 5 ? (limit === 5 ? expandResults : () => setLimit(5)) : null}
      className="pb-32 pt-4"
    >
      {loading ? (
        <Loader />
      ) : musicInfo.length === 0 ? (
        <EmptyState 
          message="No trending songs available" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          } 
        />
      ) : isAboveMedium ? (
        <div className="w-full animate-fadeIn">
          {/* Table header */}
          <div className="w-full bg-deep-grey/50 flex items-center gap-4 p-3 mb-2 text-gray-400 text-sm font-medium rounded-lg">
            <span className="text-center w-8">#</span>
            <span className="w-10"></span> {/* Album art space */}
            <span className="flex-grow">SONG</span>
            <span className="flex-grow hidden md:block">ALBUM</span>
            <span className="w-16 text-center hidden sm:block">TIME</span>
            <span className="w-8"></span> {/* Play button space */}
          </div>
          {/* Table rows */}
          <div className="space-y-1">
            {musicInfo.slice(0, limit).map((song, index) => (
              <div
                key={song.id}
                onClick={() => play(song.id)}
                className="w-full flex items-center gap-4 p-2 hover:bg-deep-grey transition-colors duration-300 rounded-lg cursor-pointer"
              >
                <span className="font-bold w-8 text-center text-sm">{index + 1}</span>
                <img src={song.image.url} alt={song.name} className="h-10 w-10 rounded-md object-cover" />
                <div className="flex-grow flex flex-col">
                  <span className="text-sm font-medium truncate">{song.name}</span>
                  <span className="text-xs text-gray-400 truncate sm:hidden">{song.album}</span>
                </div>
                <span className="text-sm flex-grow truncate hidden md:block">{song.album}</span>
                <span className="text-sm w-16 text-center hidden sm:block">{song.duration}</span>
                <button className="h-8 w-8 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-melody-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="h-24" />
        </div>
      ) : (
        <div className="w-full overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory">
          {/* Mobile view - horizontal scroll */}
          <div className="flex space-x-3 p-2 pb-4">
            {musicInfo.map((song) => (
              <div
                key={song.id}
                onClick={() => play(song.id)}                className="bg-melody-purple-800 rounded-lg overflow-hidden min-w-[130px] max-w-[130px] md:min-w-[160px] md:max-w-[160px] lg:min-w-[180px] lg:max-w-[180px] xl:min-w-[190px] xl:max-w-[190px]
                transition-all duration-300 hover:scale-102 cursor-pointer 
                border border-melody-purple-700 hover:border-melody-pink-600/50"
              >
                <AlbumArt src={song.image.url} alt={song.name} />
                <CardInfo title={song.name} subtitle={song.album} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

export default Trending;
