import useMediaQuery from "../useMedia";
import album from "../assets/albumfull.svg";
import { useEffect, useState, useContext } from "react";
import { Context } from "../context.js";
import he from "he";
import { Link } from "react-router-dom";
import { albumsongs } from "../saavnapi";

function AlbumFull({ names }) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setInneralbum, setSelected } = useContext(Context);
  const [limit, setLimit] = useState(5);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);

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
            image: song.image[2] ? song.image[2] : song.image[1],
            artist: song.artists.primary[0].name,
            year: song.year,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [names]);

  const play = async (id) => {
    localStorage.setItem("innerAlbum", id);
    setInneralbum(id);
    localStorage.setItem("selected", "/albums");
    setSelected("/albums");
  };

  return (
    <>
      {!loading ? (
        <>
          {isAboveMedium ? (
            <div className="h-screen w-5/6 m-12 mb-12 flex flex-col bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 shadow-lg rounded-lg overflow-y-auto no-scrollbar pb-32 pt-4">
              <div className="w-full flex flex-col md:flex-row items-center p-6 bg-gradient-to-tr from-deep-grey via-deep-blue to-deep-blue border-b border-gray-700 shadow-md mb-8">
                <img
                  src={album}
                  alt="Album Art"
                  className="h-48 w-48 rounded-lg shadow-lg object-cover"
                />
                <div className="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <h1 className="font-bold text-2xl md:text-3xl text-white mb-2">
                    Trending Songs <span className="text-melody-pink-500">Mix</span>
                  </h1>
                  <p className="text-gray-300 mt-2">
                    {musicInfo.length} Albums • Updated Weekly
                  </p>
                </div>
              </div>
              <div className="p-4">
                {musicInfo.slice(0, limit).map((song, index) => (
                  <Link to="/innerAlbum" key={song.id}>
                    <div
                      className="flex items-center gap-4 p-4 m-2 rounded-lg bg-deep-grey/50 hover:bg-melody-pink-600/20 transition-all duration-300 cursor-pointer transform hover:scale-[1.01]"
                      onClick={() => play(song.id)}
                    >
                      <span className="text-sm w-8 text-gray-400 text-center">#{index + 1}</span>
                      <img src={song.image.url} className="h-12 w-12 rounded-md object-cover" alt={song.name} />
                      <div className="flex-grow">
                        <h3 className="text-white font-medium">{song.name}</h3>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                      <span className="text-sm text-gray-400">{song.year}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex justify-center my-6 mb-4">
                {musicInfo.length > 5 && (
                  <button
                    onClick={limit === 5 ? expandResults : () => setLimit(5)}
                    className="px-4 py-2 rounded-full bg-melody-pink-500 text-white font-medium hover:bg-melody-pink-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-melody-pink-300 shadow-md"
                  >
                    {limit === 5 ? "View All" : "View Less"}
                  </button>
                )}
              </div>
              <div className="h-24" />
            </div>
          ) : (
            <div className="h-screen w-full flex flex-col bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 shadow-lg overflow-y-auto no-scrollbar pb-32 pt-4">
              <div className="w-full flex flex-col items-center p-4 bg-gradient-to-tr from-deep-grey via-deep-blue to-deep-blue border-b border-gray-700 shadow-md mb-8">
                <img
                  src={album}
                  alt="Album Art"
                  className="h-36 w-36 rounded-lg shadow-lg object-cover"
                />
                <div className="mt-3 text-center">
                  <h1 className="font-bold text-xl text-white">
                    Trending Songs <span className="text-melody-pink-500">Mix</span>
                  </h1>
                  <p className="text-gray-300 text-sm mt-1">
                    {musicInfo.length} Albums
                  </p>
                </div>
              </div>

              <div className="p-2">
                {musicInfo.slice(0, limit).map((song, index) => (
                  <Link to="/innerAlbum" key={song.id}>
                    <div
                      className="flex items-center gap-3 p-3 mx-2 my-1 rounded-lg bg-deep-grey/50 hover:bg-melody-pink-600/20 transition-all duration-300 cursor-pointer"
                      onClick={() => play(song.id)}
                    >
                      <span className="text-xs w-6 text-gray-400 text-center">#{index + 1}</span>
                      <img src={song.image.url} className="h-10 w-10 rounded-md object-cover" alt={song.name} />
                      <div className="flex-grow min-w-0">
                        <h3 className="text-white text-sm font-medium truncate">{song.name}</h3>
                        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex justify-center my-6">
                {musicInfo.length > 5 && (
                  <button
                    onClick={limit === 5 ? expandResults : () => setLimit(5)}
                    className="px-4 py-2  mb-16 rounded-full bg-melody-pink-500 text-white text-sm font-medium hover:bg-melody-pink-600 transition-colors duration-300 focus:outline-none shadow-md"
                  >
                    {limit === 5 ? "View All" : "View Less"}
                  </button>
                )}
              </div>
              <div className="h-24" />
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-melody-pink-500/30 h-16 w-16 flex items-center justify-center mb-3">
              <svg className="animate-spin h-8 w-8 text-melody-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <span className="text-melody-pink-500 text-lg font-medium">Loading albums...</span>
          </div>
        </div>
      )}
    </>
  );
}
export default AlbumFull;