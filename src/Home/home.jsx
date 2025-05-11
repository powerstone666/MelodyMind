import React, { useContext, useEffect } from "react";
import Topsongs from "./topsong";
import Newrelease from "./newrelease";
import Trending from "../Trendy/trending";
import Artist from "../Playlist/artist";
import Albums from "../Albumsongs/albums";
import { Context } from "../context.js"; // Make sure to use the right import
import { Section } from "../components/UI";

function Home() {
  const { setViewall, setPage, page } = useContext(Context);

  const handleViewAll = (name) => {
    if (page === name) {
      setViewall(3);
      setPage("");
    } else {
      setViewall(40);
      setPage(name);
    }
  };

  // Add a subtle fade-in animation on mount
  useEffect(() => {
    const sections = document.querySelectorAll('.section-animate');
    sections.forEach((section, index) => {
      section.style.animationDelay = `${index * 0.1}s`;
      section.classList.add('animate-fadeIn');
    });
  }, []);
  return (
    <div className="overflow-y-auto h-screen w-full text-white pb-24 no-scrollbar">
      <div className="p-4 space-y-8">
        {/* Hero Section */}        <div className="mx-4 my-6 rounded-2xl bg-gradient-to-r from-deep-grey to-deep-blue p-6 shadow-lg animate-fadeIn">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-rainbow text-transparent bg-clip-text">
            Welcome to MelodyMind
          </h1>
          <p className="text-gray-300 mb-4">Discover music that matches your mood</p>
        </div>
        
        {/* Content Sections */}
        <div className="space-y-12 stagger-animate">          <div className="section-animate">
            <Topsongs names="Weekly Hits" />
          </div>

          <div className="section-animate">
            <Newrelease />
          </div>

          <div className="section-animate">
            <Trending />
          </div>

          <div className="section-animate">
            <Artist />
          </div>

          <div className="section-animate">
            <Albums />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
