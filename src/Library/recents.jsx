import { fetchHistory, deleteRecents } from "../Firebase/database";
import useMediaQuery from "../useMedia";
import { useEffect, useState, useContext } from "react";
import { Context } from "../main";

function Recents() {
  const [likes, setLikes] = useState([]);
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { setSongid } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const localUser = JSON.parse(localStorage.getItem("Users"));

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetchHistory();

        if (res.length > 100) {
          const sortedRes = res.sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp to find the oldest
          const oldestSong = sortedRes[0]; // Get the oldest song
          await deleteRecents(oldestSong.id); // Delete the oldest song
          res.shift(); // Remove the oldest song from the array
        }

        setLikes(res);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLikes();
  }, []);

  const play = (id) => {
    localStorage.setItem("songid", id);
    setSongid(id);
  };

  const deleteRecent = async (id) => {
    try {
      await deleteRecents(id);
      // Update the likes state after deletion
      setLikes(likes.filter((song) => song.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!loading ? (
        <>
          {localUser ? (
            <>
              {isAboveMedium ? (
                <div
                  className="h-screen w-5/6 m-12 mb-12 flex flex-col bg-gradient-album border-1 border-deep-grey shadow-lg overflow-y"
                  style={{
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div className="w-full h-2/6 bg-white flex bg-gradient-album p-4 border-y-1 border-deep-grey shadow-2xl">
                    <img src="https://cdn-icons-png.flaticon.com/512/7462/7462205.png" />
                    <h1 className="font-bold text-3xl p-5">
                      Recent <span className="text-red">Songs</span>
                    </h1>
                  </div>

                  {localUser &&
                    likes.map((song, index) => (
                      <div
                        className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                        key={song.id}
                      >
                        <h1 className="text-2xl w-12">#{index + 1}</h1>
                        <img
                          src={song.songUrl}
                          className="h-12"
                          onClick={() => play(song.songId)}
                        />
                        <h1 className="text-md flex-grow">{song.songName}</h1>
                        <h1
                          className="text-blue text-2xl cursor-pointer"
                          onClick={() => deleteRecent(song.id)}
                        >
                          X
                        </h1>
                      </div>
                    ))}

                  <div className="h-2/6 mb-24"></div>
                </div>
              ) : (
                <div
                  className="h-screen w-full mb-24 flex flex-col bg-gradient-album border-1 border-deep-grey shadow-lg overflow-y"
                  style={{
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div className="w-full h-2/6 bg-white flex bg-gradient-album p-4 border-y-1 border-deep-grey shadow-2xl">
                    <img src="https://cdn-icons-png.flaticon.com/512/7462/7462205.png" />
                    <h1 className="font-bold text-2xl p-5">
                      Recents <span className="text-red">Songs</span>
                    </h1>
                  </div>
                  {localUser &&
                    likes.map((song, index) => (
                      <div
                        className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                        key={song.songId}
                      >
                        <p className="text-sm w-full">#{index + 1}</p>
                        <img
                          src={song.songUrl}
                          className="h-12"
                          onClick={() => play(song.songId)}
                        />
                        <p className="text-sm flex-grow">{song.songName}</p>
                        <h1
                          className="text-blue text-2xl cursor-pointer"
                          onClick={() => deleteRecent(song.id)}
                        >
                          X
                        </h1>
                      </div>
                    ))}
                  <div className="h-80 mb-32"></div>
                  
                </div>
              )}
                
            </>
          ) : (
            <h1 className="text-red text-3xl font-bold">
              Login to view your likes
            </h1>
          )}
        </>
      ) : (
        <span className="text-red text-3xl font-bold">Loading.....</span>
      )}
    </>
  );
}

export default Recents;