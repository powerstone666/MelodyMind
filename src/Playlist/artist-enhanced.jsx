import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context.js";
import useMediaQuery from "../useMedia";
import { artist } from "../saavnapi";
import { Link } from "react-router-dom";
import { Card, CardInfo, Loader, EmptyState, Button, Section } from '../components/UI';

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
        const res = await artist();

        if (res.data && res.data.data && res.data.data.results) {          setMusicInfo(
            res.data.data.results.map((song) => ({
              id: song.id,
              name: song.name,
              image: song.image[2] ? song.image[2].url : song.image[1].url,
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

  const play = (id) => {
    localStorage.setItem("singer", id);
    setSinger(id);
    localStorage.setItem("selected", "/");
    setSelected("/");
  };

  // Custom Artist Card component for circular images
  const ArtistCard = ({ image, name, onClick }) => {
    return (      <div 
        onClick={onClick}
        className="bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col items-center p-4 min-w-[130px] max-w-[130px] md:min-w-[160px] md:max-w-[160px] lg:min-w-[180px] lg:max-w-[180px] xl:min-w-[190px] xl:max-w-[190px]"
      >
        <div className={`relative overflow-hidden rounded-full mb-3 ${isAboveMedium ? 'h-36 w-36' : 'h-28 w-28'} border-2 border-melody-pink-500/30 shadow-lg shadow-melody-pink-500/20`}>
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-deep-grey text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className={`${isAboveMedium ? 'h-12 w-12' : 'h-10 w-10'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}        </div>
        <h3 className={`font-medium text-center truncate max-w-full ${isAboveMedium ? 'text-sm' : 'text-xs'} text-white group-hover:text-melody-pink-500 transition-colors duration-300`}>{name}</h3>
      </div>
    );
  };

  return (
    <Section 
      title="Popular Artists"
      onViewAll={musicInfo.length > 5 ? (limit === 5 ? expandResults : () => setLimit(5)) : null}
    >
      {loading ? (
        <Loader />
      ) : musicInfo.length === 0 ? (
        <EmptyState 
          message="No artists available" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          } 
        />
      ) : (
        <>
          {(isAboveMedium ? musicInfo.slice(0, limit) : musicInfo).map((artist) => (
            <Link key={artist.id} to="/innerartist" className="block min-w-[140px]">
              <ArtistCard 
                image={artist.image} 
                name={artist.name} 
                onClick={() => play(artist.id)}
              />
            </Link>
          ))}
        </>
      )}
    </Section>
  );
}

export default Artist;
