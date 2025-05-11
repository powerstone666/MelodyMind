import axios from "axios";
import viewall from "../assets/viewall.svg";
import viewclose from "../assets/viewclose.svg";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context.js";
import useMediaQuery from "../useMedia";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";
import { addRecents } from '../Firebase/database';
import { Card, CardInfo, AlbumArt, Loader, EmptyState, Section } from '../components/UI';
import logger from '../utils/logger';

function Topsongs({ names }) {
  const { setSongid, Viewall, page } = useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");

  const expandResults = () => {
    setLimit(musicInfo.length);
  };  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching songs for:', names);
        const res = await MelodyMusicsongs(names);
        console.log('API Response for Weekly Hits:', res);
        if (res && Array.isArray(res)) {          // Log the first song to debug the structure
          if (res.length > 0) {
            console.log('Sample song structure:', JSON.stringify(res[0], null, 2));
          }
          
          setMusicInfo(
            res.map((song) => {
              // Handle different image formats from various API endpoints
              let imageUrl = '';
              if (typeof song.image === 'string') {
                imageUrl = song.image;
              } else if (song.image && song.image.url) {
                imageUrl = song.image.url;              } else if (song.image && Array.isArray(song.image)) {
                if (song.image[2]) {
                  imageUrl = typeof song.image[2] === 'string' ? song.image[2] : song.image[2].url || '';
                } else if (song.image[1]) {
                  imageUrl = typeof song.image[1] === 'string' ? song.image[1] : song.image[1].url || '';
                }
              } else if (song.image) {
                imageUrl = typeof song.image === 'object' ? song.image.link || '' : '';
              }
              
              return {
                id: song.id,
                name: he.decode(song.name || ''),
                image: imageUrl,
                artist: song.primaryArtists ? he.decode(song.primaryArtists) : '',
                year: song.year || '',
              };
            })
          );
          console.log('Processed music info:', musicInfo);
        } else {
          console.log('No data or invalid data format returned from API');
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
  };  return (
    <Section 
      title={names || "Weekly Hits"} 
      onViewAll={musicInfo.length > 5 ? (limit === 5 ? expandResults : () => setLimit(5)) : null}
    >
      {loading ? (
        <Loader />
      ) : musicInfo.length === 0 ? (
        <EmptyState
          message="No songs available right now"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          }
        />
      ) : (
        // Unified view for both mobile and desktop
        <>          {(isAboveMedium ? musicInfo.slice(0, limit) : musicInfo).map((song) => (           
           <Card
              key={song.id}
              onClick={() => play(song.id, song.name, song.image)}
            >
              <AlbumArt 
                src={typeof song.image === 'string' ? song.image : (song.image?.url || '')} 
                alt={song.name} 
              />
              <CardInfo 
                title={song.name} 
                subtitle={
                  <div className="flex items-center">
                    {song.artist && (
                      <span className="truncate text-sm">{song.artist}</span>
                    )}
                    {song.artist && song.year && (
                      <span className="mx-1">•</span>
                    )}
                    {song.year && (
                      <span className="text-xs text-gray-400">{song.year}</span>
                    )}
                  </div>
                }
              />
            </Card>
          ))}
        </>
      )}
    </Section>
  );
}

export default Topsongs;
