import React, { useContext, useEffect, useState } from "react";
import useMediaQuery from "../useMedia";
import { fetchUser } from "../Firebase/database"; // Changed from getLikes to fetchUser
import { doc, getDoc } from "firebase/firestore";
import { Context } from "../context.js"; // Updated import
import album from "../assets/albumfull.svg";

function Likes() {
    const [likes, setLikes] = useState([]);
    const isAboveMedium = useMediaQuery("(min-width:768px)");
    const { setSongid } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const localUser = JSON.parse(localStorage.getItem("Users"));

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await fetchUser();
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

    return (
        <>
            {!loading ? (
                <>
                    {localUser ? (
                        <>
                            {isAboveMedium ? (
                                <div className="h-screen w-5/6 m-12 mb-28 flex flex-col bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 shadow-lg rounded-lg overflow-y-auto no-scrollbar pb-36">
                                    <div className="w-full flex flex-col md:flex-row items-center p-6 bg-gradient-to-tr from-deep-grey via-deep-blue to-deep-blue border-b border-gray-700 shadow-md">
                                        <img 
                                            src="https://misc.scdn.co/liked-songs/liked-songs-300.png" 
                                            alt="Liked Songs"
                                            className="h-36 w-36 rounded-lg shadow-lg object-cover" 
                                        />
                                        <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                                            <h1 className="font-bold text-2xl md:text-3xl text-white">
                                                Liked <span className="text-melody-pink-500">Songs</span>
                                            </h1>
                                            <p className="text-gray-300 mt-2">
                                                {likes.length} Songs • Your Collection
                                            </p>
                                        </div>
                                    </div>

                                    {localUser && likes.map((song, index) => (
                                        <div
                                            className="flex items-center gap-4 p-4 m-2 rounded-lg bg-deep-grey/50 hover:bg-melody-pink-600/20 transition-all duration-300 cursor-pointer transform hover:scale-[1.01]"
                                            key={song.id}
                                            onClick={() => play(song.songId)}
                                        >
                                            <span className="text-sm w-8 text-gray-400 text-center">#{index + 1}</span>
                                            <img src={song.songUrl} className="h-12 w-12 rounded-md object-cover" alt={song.songName} />
                                            <div className="flex-grow">
                                                <h3 className="text-white font-medium">{song.songName}</h3>
                                                <p className="text-sm text-gray-400">{song.songYear}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <button className="p-2 hover:bg-melody-pink-500/20 rounded-full transition-all duration-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-melody-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="h-2/6 mb-24"></div>
                                </div>
                            ) : (
                                <div className="h-screen w-full mb-28 flex flex-col bg-gradient-to-br from-deep-grey to-deep-blue border border-gray-700 shadow-lg overflow-y-auto no-scrollbar pb-32">
                                    <div className="w-full flex flex-col items-center p-4 bg-gradient-to-tr from-deep-grey via-deep-blue to-deep-blue border-b border-gray-700 shadow-md">
                                        <img 
                                            src='https://misc.scdn.co/liked-songs/liked-songs-300.png' 
                                            alt="Liked Songs"
                                            className="h-36 w-36 rounded-lg shadow-lg object-cover" 
                                        />
                                        <div className="mt-3 text-center">
                                            <h1 className="font-bold text-xl text-white">
                                                Liked <span className="text-melody-pink-500">Songs</span>
                                            </h1>
                                            <p className="text-gray-300 text-sm mt-1">
                                                {likes.length} Songs
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="p-2">
                                        {localUser && likes.map((song, index) => (
                                            <div
                                                className="flex items-center gap-3 p-3 mx-2 my-1 rounded-lg bg-deep-grey/50 hover:bg-melody-pink-600/20 transition-all duration-300 cursor-pointer"
                                                key={song.songId}
                                                onClick={() => play(song.songId)}
                                            >
                                                <span className="text-xs w-6 text-gray-400 text-center">#{index + 1}</span>
                                                <img src={song.songUrl} className="h-10 w-10 rounded-md object-cover" alt={song.songName} />
                                                <div className="flex-grow min-w-0">
                                                    <h3 className="text-white text-sm font-medium truncate">{song.songName}</h3>
                                                    <p className="text-xs text-gray-400 truncate">{song.songYear}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="h-80 mb-32"></div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <h1 className="text-red text-3xl font-bold">Login to view your likes</h1>
                    )}
                </>
            ) : (
                <span className="text-red text-3xl font-bold">Loading.....</span>
            )}
        </>
    );
}

export default Likes;
