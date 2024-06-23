import React, { useContext, useState } from "react";
import useMediaQuery from "../useMedia";
import Swipe from "../components/swipe";
import Topsongs from "./topsong";
import Newrelease from "./newrelease";
import Trending from "../Trendy/trending";
import Artist from "../Playlist/artist";
import Albums from "../Albumsongs/albums";
import { Context } from "../main";
import Trendingmobile from "./trendingmobile";

function Home() {
  const isAboveMedium = useMediaQuery("(min-width:1025px)");
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
          <Swipe />
          <div className="mb-8">
            <h1 className="text-3xl p-4 m-5">
              Weekly Top <span className="text-red font-bold">Songs</span>
            </h1>
            <Topsongs />
          </div>
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
              Popular <span className="text-red font-bold">Artists</span>
            </h1>
            <Artist />
          </div>
          <div className="mb-16">
            <h1 className="text-3xl p-4 m-5">
              Top <span className="text-red font-bold">Album</span>
            </h1>
            <Albums />
          </div>
        </div>
      ) : (
        <>
       <div className="overflow-y-auto h-screen w-full">
  <h1 className="text-2xl p-2 m-1">
    Weekly Top <span className="text-red font-bold">Songs</span>
  </h1>
  <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2">
    <Topsongs />
  </div>
  
  <h1 className="text-2xl p-2 m-1">
    New Releases <span className="text-red font-bold">Songs</span>
  </h1>
  <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2">
    <Newrelease />
  </div>
  
  <h1 className="text-2xl p-2 m-1">
    Trending <span className="text-red font-bold">Songs</span>
  </h1>
  <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2">
    <Trendingmobile names={"songs"} />
  </div>
  
  <h1 className="text-2xl p-2 m-1">
    Popular <span className="text-red font-bold">Artists</span>
  </h1>
  <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2">
    <Artist />
  </div>
  
  <h1 className="text-2xl p-2 m-1">
    Popular <span className="text-red font-bold">Albums</span>
  </h1>
  <div className="flex overflow-x-scroll overflow-y-hidden space-x-2 p-2 mb-24">
    <Albums />
  </div>
  
  <div className="h-16"></div>
</div>

        </>
      )}
    </>
  );
}
export default Home;
