import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import Topsongs from "../Home/topsong";
import useMediaQuery from "../useMedia";
import Trending from "../Trendy/trending";

function Searchfunc() {
  const { search,setSearch } = useContext(Context);
  const [rerender, setRerender] = useState(false);
  const isAboveMedium = useMediaQuery('(min-width:768px)');
  // Listen for changes in the search state
  useEffect(() => {
    // Set rerender to true whenever search changes
    setRerender(true);
  }, [search]); // Update the dependency array to include search
 
const searchquery=(e)=>{
    setSearch(e.target.value);
   
}
  return (
    <div>
    {isAboveMedium ? (
        <>
            <h1 className="p-4 text-xl font-bold">Search <span className="text-red">Results....</span></h1>
            {rerender && search && (
                <Topsongs names={search} />
            )}
        </>
    ) : (
        <div className="">
            <div className="flex">
            <input type="text" placeholder="Search For Musics, Artists, Albums..." className="p-4 h-8 w-80 bg-transparent outline-none " onChange={(e)=>searchquery(e)} value={search} />
             <button className="w-16 border-0 rounded-md bg-red text-black" >search</button>
                </div>
                {rerender && search && (
                <Trending names={search} />
            )}
        </div>
    )}
</div>

  );
}

export default Searchfunc;
