import React, { useContext } from "react";
import Swipe from "../components/swipe";
import Topsongs from "./topsong";
import Newrelease from "./newrelease";
import Trending from "../Trendy/trending";
import Artist from "../Playlist/artist";
import Albums from "../Albumsongs/albums";
import { Context } from "../main";

function Home() {
  const { setViewall, setPage, page } = useContext(Context);

    const Section = ({ title, children }) => {
        return (
          <div className="mb-8">
            <div className="flex items-center justify-between px-6">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="flex overflow-x-auto space-x-4 p-4">
              {children}
            </div>
          </div>
        );
      };
    
      const Card = ({ children }) => {
        return (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden min-w-[150px] max-w-[150px] md:min-w-[200px] md:max-w-[200px]">
            {children}
          </div>
        );
      };
    
      const AlbumArt = ({ src, alt }) => {
        return (
          <img src={src} alt={alt} className="w-full h-auto rounded-lg shadow-md object-cover" />
        );
      };


    const handleCLick = (name) => {
    if (page === name) {
      setViewall(3);
      setPage("");
    } else {
      setViewall(40);
      setPage(name);
    }
  };

  return (
    <div className="overflow-y-auto h-screen w-full text-white">
      <div className="p-4">
        <Section title="Weekly Top Songs">
          <Topsongs />
        </Section>

        <Section title="New Releases">
          <Newrelease />
        </Section>

        <Section title="Trending Songs">
          <Trending />
        </Section>

        <Section title="Popular Artists">
          <Artist />
        </Section>

        <Section title="Top Albums">
          <Albums />
        </Section>
        </div>
      {/* Example of how to use the new components */}
    {/* <Section title="Trending Now">
      <Card>
        <AlbumArt src="https://via.placeholder.com/200" alt="Album Art" />
        <div>
        
        </div>
      </Card>
    </Section> */}
    </div>
  );
}
export default Home;
