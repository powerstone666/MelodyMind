import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context.js"; // Update Context import
import { FaSearch, FaTimes, FaMusic } from "react-icons/fa";

import useMediaQuery from "../useMedia";
import Result from "../Search/result";
import Topsongs from "../Home/topsong";

function Searchfunc() {
  const { search, setSearch } = useContext(Context);
  const [rerender, setRerender] = useState(false);
  const isAboveMedium = useMediaQuery("(min-width:1025px)");

  // Listen for changes in the search state
  useEffect(() => {
    setRerender(true);
  }, [search]);

  const searchquery = (e) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="min-h-screen overflow-y-auto no-scrollbar pb-24 pt-4 bg-gradient-to-br from-[#1e2746] via-[#232946] to-[#2d3250] text-white">
      {isAboveMedium ? (
        <>
        

          {rerender && search ? (
            <div className="h-screen">
              <Result names={search} />
            </div>
          ) : (
            <div>
              
              <Topsongs names={"Top songs"} />
            </div>
          )}
        </>
      ) : (
        <div className="h-screen">
          <div className="sticky top-2 z-50 mx-auto w-[90%] max-w-xs mb-4">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full shadow-lg px-4 py-2.5 backdrop-blur-md">
              <FaSearch className="text-[#ff6b81] text-sm" />
              <input
                type="text"
                placeholder="Search music..."
                className="flex-grow bg-transparent outline-none text-white placeholder:text-white/60 text-sm"
                onChange={searchquery}
                value={search}
              />
              {search && (
                <button
                  className="text-[#ff6b81] text-sm p-1 hover:bg-white/10 rounded-full transition-all"
                  onClick={clearSearch}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {rerender && search ? (
            <div>
              <Result names={search} />
              
            </div>
          ) : (
            <div className="px-4">
              <div className="flex flex-col items-center justify-center py-6 mb-2">
             
              </div>
             
              <Topsongs names={"Top songs"} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Searchfunc;
