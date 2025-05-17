import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context.js";
import useMediaQuery from "../useMedia";
import { albumsongs } from "../saavnapi";
import { Link } from "react-router-dom";
import he from "he";
import { Card, CardInfo, AlbumArt, Loader, EmptyState, Button, Section } from '../components/UI';

function Albums() {
  const { setSongid, setInneralbum, setSelected, page, Viewall } = useContext(
    Context
  );
  const [limit, setLimit] = useState(7);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAboveMedium = useMediaQuery("(min-width:1025px)");

  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        setLoading(false);
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
    <Section 
      title="Top Albums" 
      onViewAll={musicInfo.length > 5 ? (limit === 7 ? expandResults : () => setLimit(7)) : null}
    >
      {loading ? (
        <Loader />
      ) : musicInfo.length === 0 ? (
        <EmptyState 
          message="No albums available" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          } 
        />
      ) : (
        // Unified view for both mobile and desktop
        <>
          {musicInfo.slice(0, limit === 5 && !isAboveMedium ? musicInfo.length : limit).map((song) => (
            <Link key={song.id} to="/innerAlbum" className="block">
              <Card onClick={() => play(song.id)}>
                <AlbumArt src={song.image} alt={song.name} />
                <CardInfo 
                  title={song.name} 
                  subtitle={song.artist} 
                />
              </Card>
            </Link>
          ))}
        </>
      )}
    </Section>
  );
}

export default Albums;
