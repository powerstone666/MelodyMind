import React, { useState, useContext } from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "../Home/topsong";
import Newrelease from "../Home/newrelease";
import Trending from "../Trendy/trending";
import Artist from "../Playlist/artist";
import Albums from "../Albumsongs/albums";
import Trendingmobile from "../Home/trendingmobile";
import Newreleasemobile from "../Home/newreleasemobile";
import { Context } from "../context.js";

// SectionCard Component
function SectionCard({ icon, title, children, gradient }) {
  return (
    <div className="relative mb-16">
      {/* Organic color patches */}
      <div className={`absolute inset-0 ${gradient || 'from-emerald-900/80 to-green-800/80'} opacity-40`}>
        <div className="absolute -top-20 -left-10 w-72 h-72 rounded-full bg-emerald-500/30 mix-blend-plus-lighter blur-3xl animate-blob"></div>
        <div className="absolute top-10 -right-10 w-72 h-72 rounded-full bg-green-400/30 mix-blend-plus-lighter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 rounded-full bg-teal-500/30 mix-blend-plus-lighter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-center gap-4 px-4 sm:px-6 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-melody-pink-500/90 to-melody-purple-500/90 backdrop-blur-xl shadow-lg transform hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 drop-shadow-lg">
            {title}
          </h2>
        </div>

        <div className="relative backdrop-blur-sm px-4 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Discover Component
function Discover() {
  const isAboveMedium = useMediaQuery("(min-width:1025px)");
  const { Viewall, setViewall, setPage, page } = useContext(Context);

  const Hero = () => (
    <div className="relative px-4 sm:px-6 mb-8 sm:mb-12">
      <div className="relative overflow-hidden rounded-[2.5rem] max-w-6xl mx-auto">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 opacity-90"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-400/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent mix-blend-soft-light"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:p-10 gap-6">
          <div className="flex-1 text-center md:text-left max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 leading-tight tracking-tight">
              Discover{" "}
              <span className="inline-block animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                Your Sound
              </span>
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/80 font-medium leading-relaxed max-w-lg mx-auto md:mx-0 mb-4">
              Your perfect playlist awaits! Dive into fresh beats, trending hits, and hidden gems.
            </p>
          </div>

          <div className="flex-shrink-0 hidden md:flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
            <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-[2px] shadow-2xl group hover:shadow-emerald-500/50 transition-shadow duration-500">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-melody-pink-500 via-melody-purple-500 to-blue-500 opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative h-full w-full rounded-2xl bg-black/50 backdrop-blur-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-12 h-12 text-white opacity-90">
                  <path className="animate-music-wave" stroke="currentColor" strokeWidth="2" d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                  <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 md:hidden overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-melody-pink-500 via-melody-purple-500 to-blue-500 animate-wave"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-y-auto h-screen w-full no-scrollbar pb-32 pt-4 bg-gradient-to-b from-black via-gray-900 to-black">
      {isAboveMedium ? (
        <>
          <Hero />
          <SectionCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path stroke="currentColor" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>}
            title="New Releases"
            gradient="from-emerald-900/80 to-green-800/80"
          >
            <Newrelease />
          </SectionCard>
          <SectionCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path stroke="currentColor" strokeWidth="2" d="M3 18v-6a9 9 0 0118 0v6"/><circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="2"/></svg>}
            title="Trending Now"
            gradient="from-green-900/80 to-teal-800/80"
          >
            <Trending />
          </SectionCard>
          <SectionCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path stroke="currentColor" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>}
            title="Featured Albums"
            gradient="from-teal-900/80 to-emerald-800/80"
          >
            <Albums />
          </SectionCard>
          <SectionCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>}
            title="Top Songs"
            gradient="from-emerald-900/80 to-green-800/80"
          >
            <Topsongs />
          </SectionCard>
          <SectionCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path stroke="currentColor" strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
            title="Popular Artists"
            gradient="from-green-900/80 to-teal-800/80"
          >
            <Artist />
          </SectionCard>
        </>
      ) : (
        <>
          <Hero />
       <SectionCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path stroke="currentColor" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>}
            title="New Releases"
            gradient="from-emerald-900/80 to-green-800/80"
          >
            <Newrelease />
          </SectionCard>
          <SectionCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path stroke="currentColor" strokeWidth="2" d="M3 18v-6a9 9 0 0118 0v6"/><circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="2"/></svg>}
            title="Trending Now"
            gradient="from-green-900/80 to-teal-800/80"
          >
            <Trending />
          </SectionCard>
          <SectionCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path stroke="currentColor" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>}
            title="Featured Albums"
            gradient="from-teal-900/80 to-emerald-800/80"
          >
            <Albums />
          </SectionCard>
          <SectionCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>}
            title="Top Songs"
            gradient="from-emerald-900/80 to-green-800/80"
          >
            <Topsongs />
          </SectionCard>
          <SectionCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 text-white"><path stroke="currentColor" strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
            title="Popular Artists"
            gradient="from-green-900/80 to-teal-800/80"
          >
            <Artist />
          </SectionCard>
        </>
      )}
    </div>
  );
}

export default Discover;
