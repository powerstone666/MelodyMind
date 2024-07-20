import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";

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
  }, [search]); // Update the dependency array to include search

  const searchquery = (e) => {
    setSearch(e.target.value);
  };
  const clearSearch = () => {
    setSearch(""); // Clear the search query
  };
  return (
    <div
      className="h-screen mb-16"
      style={{
        overflowY: "scroll",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {isAboveMedium ? (
        <>
     
          {rerender && search ? (
              <div className="h-screen">
            <Result names={search} />
            </div>
          ) : (
            <Topsongs names={"Top songs"} />
          )}
        </>
      ) : (
        <div className="h-screen">
          <div className="flex w-80 h-10 p-2 bg-black ml-4 border-b-2  border-red rounded-md">
            <input
              type="text"
              placeholder="Search For Musics, Artists, Albums..."
              className="p-4 h-8 w-80 bg-transparent outline-none "
              onChange={(e) => searchquery(e)}
              value={search}
            />
              {search && (
                  <button className="text-blue text-md" onClick={clearSearch}>
                    X
                  </button>
                )}
  
          </div>
          {rerender && search ? (
            <>
              <Result names={search} />
              <div className="h-24"></div>
            </>
          ) : (
            <Topsongs names={"Top songs"} />
          )}
        </div>
      )}
    </div>
  );
}

export default Searchfunc;
