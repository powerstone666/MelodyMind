import useMediaQuery from "../useMedia";
import album from "../assets/albumfull.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { Context } from "../main";
import he from "he";
import { MelodyMusicsongs, albumsongs, albumsongsinner, artist, artistSongs, searchResult } from "../saavnapi";
import { Link } from "react-router-dom";

function Innerartist({names}) {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid,singer,page,setInneralbum,setSelected} = useContext(Context);
 const[image,setimage]=useState([]);
const[albuminfo,setAlbuminfo]=useState([]);
  const [musicInfo, setMusicInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  // Function to handle expanding to show more results
  const expandResults = () => {
    setLimit(musicInfo.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artistSongs(singer);
       setimage(res.data.data);
      
        setMusicInfo(
          res.data.data.topSongs.map((song) => ({
            id: song.id,
            name: he.decode(song.name),
            image: song.image[1].url,
            artist: song.artists.primary[0].name,
            year: song.year,
          }))
        );
        setAlbuminfo(
            res.data.data.topAlbums.map((song) => ({
              aid: song.id,
              aname: he.decode(song.name),
              aimage: song.image[1].url,
              aartist: song.artists.primary[0].name,
              ayear: song.year,
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
  localStorage.setItem("songid", id);
  setSongid(id);
  };
  const plays = async (id) => {
  
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
            <div
              className="h-screen w-5/6 m-12  mb-28 flex flex-col bg-gradient-album border-1 border-deep-grey shadow-lg overflow-y"
              style={{
                overflowY: "scroll",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              
              <div className="w-full h-2/6 bg-white flex bg-gradient-album p-4 border-y-1 border-deep-grey shadow-2xl">
                <img src={image.image[1].url} />
                <h1 className="font-bold text-3xl p-5">
                  {image.name} 
                </h1>
              </div>
              {musicInfo.slice(0, musicInfo.length).map((song, index) => (
                <div
                  className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <h1 className="text-2xl w-12">#{index + 1}</h1>{" "}
                  {/* Fixed width for index */}
                  <img src={song.image} className="h-12" />{" "}
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
              ))}
              <h1 className="text-2xl p-2 m-2">
            Top <span className="text-red font-bold">Albums</span>
            </h1>
              {albuminfo.slice(0, albuminfo.length).map((song, index) => (
                  <Link to="/innerAlbum">
                <div
                  className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                  key={song.aid}
                  onClick={() => plays(song.aid)}
                >
                  <h1 className="text-2xl w-12">#{index + 1}</h1>{" "}
                  {/* Fixed width for index */}
                  <img src={song.aimage} className="h-12" />{" "}
                  {/* Keep image size fixed */}
                  <h1 className="text-md flex-grow">{song.ayear}</h1>{" "}
                  {/* Allow year to take remaining space */}
                  <h1 className="text-md flex-grow">{song.aname}</h1>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                    className="h-12"
                  />{" "}
                  {/* Keep image size fixed */}
                </div>
                </Link>
              ))}
              <div className="flex  mb-8">
              
              </div>
            </div>
          ) : (
            <div
              className="h-screen w-full   mb-24 flex flex-col bg-gradient-album border-1 border-deep-grey shadow-lg overflow-y"
              style={{
                overflowY: "scroll",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="w-full h-2/6 bg-white flex bg-gradient-album p-4 border-y-1 border-deep-grey shadow-2xl">
                <img src={image.image[1].url} />
                <h1 className="font-bold text-md p-5">
                  {image.name} <span className="text-red">{image.language}</span>
                </h1>
              </div>
              {musicInfo.slice(0, musicInfo.length).map((song, index) => (
                <div
                  className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <p className="text-sm w-full">#{index + 1}</p>{" "}
                  {/* Fixed width for index */}
                  <img src={song.image} className="h-12" />{" "}
                  {/* Keep image size fixed */}
                  <p className="text-sm flex-grow">{song.year}</p>{" "}
                  {/* Allow year to take remaining space */}
                  <p className="text-sm flex-grow">{song.name}</p>
               
                  {/* Keep image size fixed */}
                </div>
              ))}
               <h1 className="text-2xl p-2 m-2">
            Top <span className="text-red font-bold">Albums</span>
            </h1>
              {albuminfo.slice(0, albuminfo.length).map((song, index) => (
                  <Link to="/innerAlbum">
                <div
                  className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                  key={song.aid}
                  onClick={() => plays(song.aid)}
                >
                  <p className="text-2xl w-12">#{index + 1}</p>{" "}
                  {/* Fixed width for index */}
                  <img src={song.aimage} className="h-12" />{" "}
                  {/* Keep image size fixed */}
                  <p className="text-md flex-grow">{song.ayear}</p>{" "}
                  {/* Allow year to take remaining space */}
                  <p className="text-md flex-grow">{song.aname}</p>
                 {" "}
                  {/* Keep image size fixed */}
                </div>
                </Link>
              ))}
              <div className="flex  ml-8  mb-36">
              
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
export default Innerartist;
