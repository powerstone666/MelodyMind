import useMediaQuery from "../useMedia";
import album from "../assets/albumfull.svg";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../context.js";
import he from "he";
import { Link } from "react-router-dom";
import {
  albumsongs
} from "../saavnapi";
function AlbumFull({ names }) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setInneralbum,setSelected } =
    useContext(Context);
  const [limit, setLimit] = useState(5);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await albumsongs();        setMusicInfo(
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
          {isAboveMedium ? (            <div              className="h-screen w-5/6 m-12  mb-12 flex flex-col bg-gradient-album border-1 border-deep-grey shadow-lg overflow-y no-scrollbar"
            >
              <div className="w-full h-2/6 bg-white flex bg-gradient-album p-4 border-y-1 border-deep-grey shadow-2xl">
                <img src={album} />
                <h1 className="font-bold text-3xl p-5">
                  Trending Songs <span className="text-red">Mix</span>
                </h1>
              </div>
              {musicInfo.slice(0, limit).map((song, index) => (
                <Link to="/innerAlbum">
                  {" "}
                  <div
                    className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                    key={song.id}
                    onClick={() => play(song.id)}
                  >
                    <h1 className="text-2xl w-12">#{index + 1}</h1>{" "}
                    {/* Fixed width for index */}
                    <img src={song.image.url} className="h-12" />{" "}
                    {/* Keep image size fixed */}
                    <h1 className="text-md flex-grow">{song.year}</h1>{" "}
                    {/* Allow year to take remaining space */}
                    <h1 className="text-md flex-grow">{song.name}</h1>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                      className="h-12"
                    />{" "}
                    {/* Keep image size fixed */}
                  </div>
                </Link>
              ))}
              <div className="flex  ml-8">
                {musicInfo.length > 5 && limit === 5 ? (
                  <button
                    onClick={expandResults}
                    className="bg-deep-grey w-32 h-12 p-2"
                  >
                    <h1 className="font-bold mb-24"> View All</h1>
                  </button>
                ) : (
                  <button
                    onClick={() => setLimit(5)}
                    className="bg-deep-grey w-32 h-12 p-2"
                  >
                    <h1 className="font-bold mb-24">View Less</h1>
                  </button>
                )}
              </div>
              <div className="h-2/6 mb-24"></div>
            </div>
          ) : (            <div              className="h-screen w-full mb-24 flex flex-col bg-gradient-album border-1 border-deep-grey overflow-y no-scrollbar"
            >
              <div className="w-full h-2/6 bg-white flex bg-gradient-album p-4 border-y-1 border-deep-grey">
                <img src={album} />
                <h1 className="font-bold text-3xl p-5">
                  Trending Songs <span className="text-red">Mix</span>
                </h1>
              </div>
              {musicInfo.slice(0, limit).map((song, index) => (
                <Link to="/innerAlbum">
                  <div
                    className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                    key={song.id}
                    onClick={() => play(song.id)}
                  >
                    <p className="text-sm w-full">#{index + 1}</p>{" "}
                    {/* Fixed width for index */}
                    <img src={song.image.url} className="h-12" />{" "}
                    {/* Keep image size fixed */}
                    <p className="text-sm flex-grow">{song.year}</p>{" "}
                    {/* Allow year to take remaining space */}
                    <p className="text-sm flex-grow">{song.name}</p>
                    {/* Keep image size fixed */}
                  </div>
                </Link>
              ))}
              <div className="flex  ml-8  mb-36">
                {musicInfo.length > 5 && limit === 5 ? (
                  <button
                    onClick={expandResults}
                    className="bg-deep-grey w-32 h-12 p-2"
                  >
                    <h1 className="font-bold mb-24"> View All</h1>
                  </button>
                ) : (
                  <button
                    onClick={() => setLimit(5)}
                    className="bg-deep-grey w-32 h-12 p-2"
                  >
                    <h1 className="font-bold mb-24">View Less</h1>
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </>
  );
}
export default AlbumFull;
