import React, { useContext, useEffect, useState } from "react";
import Topsongs from "./topsong";
import Newrelease from "./newrelease";
import Trending from "../Trendy/trending";
import Artist from "../Playlist/artist";
import Albums from "../Albumsongs/albums";
import { Context } from "../context.js";
import { Section } from "../components/UI";
import { fetchPlaylistsByCategory, fetchPlaylistDetails, MelodyMusicsongs } from "../saavnapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// PlaylistList component for vertical playlist display
function PlaylistList({ playlists, onSelect }) {
  return (
    <div className="flex flex-col gap-3 px-2 pb-4">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/40 shadow hover:scale-[1.01] hover:shadow-lg transition-all cursor-pointer overflow-hidden p-2"
          onClick={() => onSelect(playlist.id)}
        >
          <img src={playlist.image?.[2]?.url || playlist.image?.[0]?.url} alt={playlist.name} className="h-16 w-16 rounded object-cover" />
          <div className="flex-grow min-w-0">
            <div className="text-base font-semibold text-white truncate mb-1">{playlist.name}</div>
            <div className="text-xs text-gray-400 truncate">{playlist.songCount || 0} songs</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Home() {
  const { setViewall, setPage, page } = useContext(Context);
  const [randomColor, setRandomColor] = useState("");
  const [playlistsByCategory, setPlaylistsByCategory] = useState({});
  const [loadingPlaylists, setLoadingPlaylists] = useState({});
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playMixLoading, setPlayMixLoading] = useState(false);
  const { setSongid } = useContext(Context); // For playback

  const quickAccessCategories = [
    { name: 'Love', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
    { name: 'Trending', icon: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941' },
    { name: 'Sad', icon: 'M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z' },
    { name: 'Workout', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
    { name: 'Best of', icon: 'M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5' },
    { name: 'Relax', icon: 'M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z' },
    { name: 'Party', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
    { name: 'Indie', icon: 'M12 4v16m8-8H4' }
  ];

  const handleViewAll = (name) => {
    if (page === name) {
      setViewall(3);
      setPage("");
    } else {
      setViewall(40);
      setPage(name);
    }
  };

  // Generate a random gradient for the hero section
  useEffect(() => {
    const gradients = [
      'from-purple-600 via-pink-600 to-red-600',
      'from-blue-600 via-purple-600 to-pink-600', 
      'from-cyan-600 via-blue-600 to-indigo-600',
      'from-emerald-600 via-teal-600 to-cyan-600',
      'from-amber-600 via-orange-600 to-red-600'
    ];
    setRandomColor(gradients[Math.floor(Math.random() * gradients.length)]);
  }, []);

  // Add a subtle fade-in animation on mount
  useEffect(() => {
    const sections = document.querySelectorAll('.section-animate');
    sections.forEach((section, index) => {
      section.style.animationDelay = `${index * 0.1}s`;
      section.classList.add('animate-fadeIn');
    });
  }, []);

  // Fetch playlists for all categories on mount
  useEffect(() => {
    quickAccessCategories.forEach(async (cat) => {
      setLoadingPlaylists((prev) => ({ ...prev, [cat.name]: true }));
      const playlists = await fetchPlaylistsByCategory(cat.name);
      setPlaylistsByCategory((prev) => ({ ...prev, [cat.name]: playlists }));
      setLoadingPlaylists((prev) => ({ ...prev, [cat.name]: false }));
    });
  }, []);

  // Fetch playlist details when selectedPlaylist changes
  useEffect(() => {
    if (selectedPlaylist) {
      setPlaylistDetails(null);
      setShowPlaylistModal(true);
      fetchPlaylistDetails(selectedPlaylist).then((details) => {
        setPlaylistDetails(details);
      });
    }
  }, [selectedPlaylist]);

  // Effect to handle navigation to Home view (e.g., from sidebar or clearing a category)
  // This ensures that if the user navigates "home" while a playlist modal or category view is active,
  // the view resets correctly.
  useEffect(() => {
    if (!page || page === "") { // Assuming an empty 'page' string signifies the main home view
      setShowPlaylistModal(false);
      setSelectedPlaylist(null);
      setPlaylistDetails(null); // Clear details when returning to home
    }
  }, [page]); // Dependency: re-run when 'page' from context changes

  // Determine which category is selected (other than 'Love' = Home)
  const selectedQuickCategory = quickAccessCategories.find(
    (cat) => page === cat.name 
  );

  // Add Play Mix handler
  const handlePlayMix = async () => {
    setPlayMixLoading(true);
    try {
      const songs = await MelodyMusicsongs("Weekly Hits");
      if (songs && songs.length > 0) {
        const firstSong = songs[0];
        localStorage.setItem("songid", firstSong.id);
        setSongid(firstSong.id);
        toast.success(`Playing: ${firstSong.name}`, { position: "top-center", autoClose: 2000 });
      } else {
        toast.error("No songs found in Weekly Hits");
      }
    } catch (err) {
      toast.error("Failed to play mix. Please try again.");
    } finally {
      setPlayMixLoading(false);
    }
  };

  return (
    <div className="overflow-y-auto h-screen w-full text-white pb-32 pt-4 no-scrollbar bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section - Visually Appealing */}
      {(!selectedQuickCategory) && (
        <>
          <div className="relative mb-4">
            {/* Background with Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${randomColor} opacity-80 rounded-none sm:rounded-2xl`}></div>
            
            {/* Mobile Wave Pattern */}
            <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-24 text-black opacity-10">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-current"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39 116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-current"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" opacity=".25" className="fill-current"></path>
              </svg>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-5 py-12 sm:px-8 sm:py-16">
              {/* Hero Content */}
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white drop-shadow-lg">
                  Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">MelodyMind</span>
                </h1>
                <p className="text-gray-200 text-sm sm:text-base max-w-md mx-auto md:mx-0">
                  Discover music that matches your mood and elevates your experience
                </p>
              </div>
              
              {/* Visual Element */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center animate-pulse-slow">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping-slow"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 sm:w-14 sm:h-14 text-white">
                        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                        <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Access Categories - Enhanced with Icons */}
          <div className="px-4 mb-8">
            <h2 className="text-sm uppercase text-gray-400 font-medium mb-3 ml-1">Quick Access <span>(playlists are under development you can only view)</span></h2>
            <div className="flex overflow-x-auto gap-3 pb-3 no-scrollbar">
              {quickAccessCategories.map((category) => (
                <div 
                  key={category.name} 
                  className={`flex flex-col items-center justify-center flex-shrink-0 transition-all cursor-pointer group relative ${page === category.name ? 'ring-2 ring-purple-500/70 scale-105 bg-gradient-to-br from-purple-800/40 to-gray-900/60' : ''}`}
                  onClick={() => handleViewAll(category.name)}
                >
                  <div className="w-16 h-16 mb-1 rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 active:scale-95 transition-all overflow-hidden">
                    <span className="absolute inset-0 pointer-events-none group-active:animate-ripple rounded-2xl"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-200">
                      <path strokeLinecap="round" strokeLinejoin="round" d={category.icon} />
                    </svg>
                  </div>
                  <span className={`text-xs ${page === category.name ? 'text-purple-300 font-semibold' : 'text-gray-300'}`}>{category.name}</span>
                </div>
              ))}
            </div>
            {/* Playlists for each Quick Access category (horizontal) except For You */}
            <div className="mt-4">
          
            </div>
          </div>
          {/* Featured Content Highlight */}
          <div className="px-4 mb-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-800/40 to-purple-800/40 backdrop-blur-sm border border-gray-700/50">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/30 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/20 rounded-full filter blur-3xl translate-y-1/3 -translate-x-1/3"></div>
              <div className="relative z-10 p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="rounded-lg overflow-hidden shadow-lg h-28 w-28 flex-shrink-0">
                  <div className="bg-gradient-to-br from-pink-600 to-purple-600 h-full w-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white">
                      <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017 5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold mb-1">Mix of the Day</div>
                  <p className="text-sm text-gray-300 mb-2">Curated just for you based on your listening habits</p>
                  <button
                    className={`flex items-center gap-2 bg-gradient-to-r from-melody-pink-600 to-melody-pink-500 hover:from-melody-pink-700 hover:to-melody-pink-600 active:scale-95 focus:ring-2 focus:ring-purple-400/60 rounded-full py-2 px-5 text-base font-semibold transition-all shadow-lg hover:shadow-purple-500/20 active:shadow-none relative overflow-hidden ${playMixLoading ? 'opacity-60 cursor-wait' : ''}`}
                    onClick={handlePlayMix}
                    disabled={playMixLoading}
                  >
                    <span className="absolute inset-0 pointer-events-none active:animate-ripple rounded-full"></span>
                    {playMixLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                    )}
                    {playMixLoading ? "Loading..." : "Play Mix"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Sections with Decorative Elements */}
          <div className="space-y-10 px-1">
            {/* Section Divider */}
            <div className="relative px-4 py-1 mb-2">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white/90 py-2">Weekly Hits</h2>
               
              </div>
            </div>
            <div className="section-animate">
              <Topsongs names="Weekly Hits" />
            </div>
            {/* Section Divider */}
            <div className="relative px-4 py-1 mb-2">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white/90 py-2">New Releases</h2>
               
              </div>
            </div>
            <div className="section-animate">
              <Newrelease />
            </div>
            {/* Section Divider */}
            <div className="relative px-4 py-1 mb-2">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white/90 py-2">Trending Now</h2>
               
              </div>
            </div>
            <div className="section-animate">
              <Artist />
            </div>
            {/* Section Divider */}
            <div className="relative px-4 py-1 mb-2">
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white/90 py-2">Featured Albums</h2>
               
              </div>
            </div>
            <div className="section-animate">
              <Albums />
            </div>
          </div>
        </>
      )}
      {/* If a Quick Access category (other than Home) is selected, show only vertical playlists for that category */}
      {selectedQuickCategory && (
        <div className="pt-4">
          <div className="px-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                className="text-xs text-gray-400 hover:text-white font-semibold px-2 py-1 rounded bg-gray-800/40"
                onClick={() => setPage('')}
              >
                &larr; Home
              </button>
              <h2 className="text-lg font-bold text-white ml-2">{selectedQuickCategory.name} Playlists</h2>
            </div>
            {loadingPlaylists[selectedQuickCategory.name] ? (
              <div className="flex flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-800/40 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <PlaylistList
                playlists={playlistsByCategory[selectedQuickCategory.name] || []}
                onSelect={setSelectedPlaylist}
              />
            )}
          </div>
        </div>
      )}
  
      {/* Playlist Modal/Drawer for selected playlist */}
      {showPlaylistModal && playlistDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-deep-grey to-deep-blue rounded-xl shadow-2xl max-w-md w-full mx-2 overflow-y-auto max-h-[90vh] relative animate-fadeIn border border-gray-700">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl font-bold z-10"
              onClick={() => setShowPlaylistModal(false)}
            >
              &times;
            </button>
            <div className="flex flex-col items-center p-6">
              <img src={playlistDetails.image?.[2]?.url || playlistDetails.image?.[0]?.url} alt={playlistDetails.name} className="w-32 h-32 rounded-lg object-cover mb-3 shadow-lg" />
              <h2 className="text-lg font-bold text-white mb-1 text-center">{playlistDetails.name}</h2>
              <div className="text-xs text-gray-300 mb-2 text-center">{playlistDetails.language}</div>
              {/* External Playlist Link Button */}
              {playlistDetails.externalUrl && (
                <a
                  href={playlistDetails.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-melody-pink-500 hover:bg-melody-pink-600 text-white font-semibold shadow transition-all duration-200 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75V3.75A2.25 2.25 0 0015 1.5h-6A2.25 2.25 0 006.75 3.75v16.5A2.25 2.25 0 009 22.5h6a2.25 2.25 0 002.25-2.25v-3" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25l5.25 5.25m0 0l-5.25 5.25m5.25-5.25H9" />
                  </svg>
                  Open in Saavn
                </a>
              )}
              <div className="w-full">
                {(playlistDetails.songs || []).map((song, idx) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-4 p-3 my-2 rounded-lg bg-deep-grey/50 hover:bg-melody-pink-600/20 transition-all duration-300 cursor-pointer transform hover:scale-[1.01]"
                    onClick={() => {
                      localStorage.setItem("songid", song.id);
                      if (window.dispatchEvent) window.dispatchEvent(new Event("storage"));
                    }}
                  >
                    <span className="text-xs w-6 text-gray-400 text-center">#{idx + 1}</span>
                    <img src={song.image?.[1]?.url || song.image?.[0]?.url} alt={song.name} className="h-10 w-10 rounded-md object-cover" />
                    <div className="flex-grow min-w-0">
                      <h3 className="text-white text-sm font-medium truncate">{song.name}</h3>
                      <p className="text-xs text-gray-400 truncate">{song.primaryArtists}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar theme="dark" />
    </div>
  );
}

export default Home;
