import React, { useState } from "react";
import useMediaQuery from "../useMedia";
import Topsongs from "../Home/topsong";
import Newrelease from "../Home/newrelease";
import Trending from "../Trendy/trending";
import Artist from "../Playlist/artist";
import Albums from "../Albumsongs/albums";
import { Context } from "../main";
import Trendingmobile from "../Home/trendingmobile";
import Newreleasemobile from "../Home/newreleasemobile";
import { useContext } from "react";
function Discover() {
  const isAboveMedium = useMediaQuery("(min-width:768px)");
  const { Viewall, setViewall, setPage, page } = useContext(Context);

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
    <>
      {isAboveMedium ? (
        <div
          className="overflow-y-auto h-screen w-full mb-12"
          style={{ overflowX: "scroll", minWidth: "100%" }}
        >
             <div className="mb-8">
            <h1 className="text-3xl p-4 m-5">
              New Releases <span className="text-red font-bold">Songs</span>
            </h1>
            <Newrelease />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl p-4 m-5">
              Trending <span className="text-red font-bold">Songs</span>
            </h1>
            <Trending />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl p-4 m-5">
              Weekly Top <span className="text-red font-bold">Songs</span>
            </h1>
            <Topsongs />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl p-4 m-5">
              Top <span className="text-red font-bold">Album</span>
            </h1>
            <Albums />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl p-4 m-5">
              Popular <span className="text-red font-bold">Artists</span>
            </h1>
            <Artist />
          </div>
       
        </div>
      ) : (
        <div
          className="overflow-y h-screen w-full"
          style={{ overflowX: "scroll" }}
        >
           <h1 className="text-2xl p-2 m-0">
            New Releases <span className="text-red font-bold">Songs</span>
          
          </h1>
          <Newrelease />
          
          <h1 className="text-2xl p-2 m-0">
            Trending <span className="text-red font-bold">Songs</span>
         
          </h1>
          <Trendingmobile names={"songs"} />
          <h1 className="text-2xl p-2 m-0">
            Popular<span className="text-red font-bold">Albums</span>
          
          </h1>
          <Albums />
          <h1 className="text-2xl p-2 m-0">
            Weekly Top <span className="text-red font-bold">Songs</span>{" "}
          
          </h1>

          <Topsongs />
         
          <h1 className="text-2xl p-2 m-0">
            Popular<span className="text-red font-bold">Artists</span>
          </h1>
          <Artist />
        
          <div className="h-2/6"></div>
        </div>
      )}
    </>
  );
}
export default Discover;
