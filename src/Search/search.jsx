import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import Topsongs from "../Home/topsong";

function Searchfunc() {
  const { search } = useContext(Context);
  const [rerender, setRerender] = useState(false);

  // Listen for changes in the search state
  useEffect(() => {
    // Set rerender to true whenever search changes
    setRerender(true);
  }, [search]); // Update the dependency array to include search

  return (
    <div>
      <h1 className="p-4 text-xl font-bold">Search <span className="text-red">Results....</span></h1>
      {rerender &&  // Conditionally render Topsongs when rerender is true
        search && (
          <Topsongs names={search} />
        ) 
      }
    </div>
  );
}

export default Searchfunc;
