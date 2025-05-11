import React, { useState, useEffect } from "react";
import { MelodyMusicsongs } from "../saavnapi";
import he from "he";
import { Context } from "../context.js";
import useMediaQuery from "../useMedia";
import { addRecents } from '../Firebase/database';
import { Card, CardInfo, AlbumArt, Loader, EmptyState, Section } from '../components/UI';

function Newrelease() {
  const time = new Date().getFullYear();
  const { setSongid } = React.useContext(Context);
  const [musicInfo, setMusicInfo] = useState([]);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const isAboveMedium = useMediaQuery("(min-width: 1025px)");

  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using a more specific search term for new releases
        const res = await MelodyMusicsongs(`new songs ${time}`);
        console.log("New releases API response:", res);
        
        if (res && Array.isArray(res)) {          setMusicInfo(
            res.map((song) => ({
              id: song.id,
              name: he.decode(song.name || ''),
              image: song.image && song.image[2] ? song.image[2].url : (song.image && song.image[1] ? song.image[1].url : ''),
              artist: song.primaryArtists ? he.decode(song.primaryArtists) : '',
              year: song.year || time.toString(),
            }))
          );
          console.log("Processed music info:", musicInfo);
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
  }, [time]);

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
    <Section 
      title={`New Releases ${time}`}
      onViewAll={musicInfo.length > 5 ? (limit === 5 ? expandResults : () => setLimit(5)) : null}
    >
      {loading ? (
        <Loader />
      ) : musicInfo.length === 0 ? (
        <EmptyState
          message="No new releases available right now"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          }
        />
      ) : (
        <>      {(isAboveMedium ? musicInfo.slice(0, limit) : musicInfo).map((song) => (
            <Card
              key={song.id}
              onClick={() => play(song.id, song.name, song.image)}
            >
              <AlbumArt src={song.image} alt={song.name} isNew={true} />
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

export default Newrelease;
