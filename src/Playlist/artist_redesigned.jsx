import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context.js";
import useMediaQuery from "../useMedia";
import { artist } from "../saavnapi";
import { Link } from "react-router-dom";
import { FiMusic, FiUser, FiChevronRight } from 'react-icons/fi';

function ArtistPage({ names }) {
  const { setSinger, Viewall, setSelected } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(12);
  const isAboveMedium = useMediaQuery("(min-width:1025px)");
  const [loading, setLoading] = useState(true);

  const expandResults = () => setLimit(musicInfo.length);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artist();
        if (res.data?.data?.results) {
          setMusicInfo(
            res.data.data.results.map((song) => ({
              id: song.id,
              name: song.name,
              image: song.image[2]?.url || song.image[1]?.url,
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
  }, []);

  const play = (id) => {
    localStorage.setItem("singer", id);
    setSinger(id);
    localStorage.setItem("selected", "/");
    setSelected("/");
  };

  if (loading) {
    return (
      <div className="w-full h-screen overflow-y-auto no-scrollbar bg-gradient-to-br from-deep-grey to-deep-blue">
        <div className="sticky top-0 z-10 bg-gradient-to-br from-deep-grey to-deep-blue py-6 px-4 md:px-8 flex items-center justify-between mb-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FiUser className="mr-2 text-melody-pink-500" /> Popular Artists
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 md:px-8">
          {Array(12).fill(0).map((_, index) => (
            <div key={index} className="animate-pulse flex flex-col items-center">
              <div className="bg-gray-800 rounded-full aspect-square w-24 sm:w-28 md:w-32 mb-3"></div>
              <div className="bg-gray-800 h-4 rounded w-3/4 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen pb-32 overflow-y-auto no-scrollbar bg-gradient-to-br from-deep-grey to-deep-blue">
      <div className="sticky top-0 z-10 bg-gradient-to-br from-deep-grey to-deep-blue py-6 px-4 md:px-8 flex items-center justify-between mb-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FiUser className="mr-2 text-melody-pink-500" /> Popular Artists
        </h2>
        {musicInfo.length > limit && !Viewall && (
          <Link 
            to="/artistpage" 
            className="px-4 py-2 text-sm font-medium text-melody-pink-500 hover:text-white bg-transparent hover:bg-melody-pink-600 border border-melody-pink-500 rounded-full transition-all duration-300 flex items-center"
            onClick={() => {
              localStorage.setItem("selected", "/artistpage");
              setSelected("/artistpage");
            }}
          >
            View All <FiChevronRight className="ml-1" />
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 md:px-8">
        {musicInfo.slice(0, Viewall ? musicInfo.length : limit).map((item, index) => (
          <Link 
            to="/innerartist" 
            key={item.id}
            onClick={() => play(item.id)}
            className="group"
          >
            <div className="flex flex-col items-center bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-2xl p-4 shadow-md hover:shadow-lg hover:from-melody-pink-900/30 hover:to-purple-900/30 transition-all duration-300">
              <div className="relative mb-3 rounded-full overflow-hidden aspect-square w-24 sm:w-28 md:w-32 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-melody-pink-900 group-hover:to-purple-900 transition-all duration-300">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  loading="lazy"
                  className="object-cover w-full h-full rounded-full brightness-90 group-hover:brightness-110 scale-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 flex items-center justify-center transition-opacity duration-300">
                  <div className="bg-melody-pink-500 rounded-full p-3 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                    <FiMusic className="text-white w-5 h-5" />
                  </div>
                </div>
              </div>
              <h3 className="text-white font-medium text-center text-sm md:text-base truncate max-w-full px-2 group-hover:text-melody-pink-500 transition-colors duration-300">{item.name}</h3>
            </div>
          </Link>
        ))}
      </div>
      
      {!Viewall && musicInfo.length > limit && (
        <div className="flex justify-center mt-10 mb-8">
          <button
            onClick={expandResults}
            className="px-8 py-3 bg-melody-pink-600 hover:bg-melody-pink-700 text-white rounded-full text-base font-semibold shadow-lg transition-colors duration-300"
          >
            Show More
          </button>
        </div>
      )}
    </div>  );
}

export default ArtistPage;
