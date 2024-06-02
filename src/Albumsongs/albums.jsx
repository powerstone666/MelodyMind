import axios from 'axios';
import viewall from '../assets/viewall.svg';
import viewclose from '../assets/viewclose.svg';
import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { Context } from '../main';
import useMediaQuery from '../useMedia';

function Albums({ names }) {
    const { setSongid } = useContext(Context);
    const [limit,setLimit]=useState(5)
    const [musicInfo, setMusicInfo] = useState([]);
   const [loading,setLoading]=useState(false)
    const isAboveMedium = useMediaQuery('(min-width:768px)');
    
    // Function to handle expanding to show more results
    const expandResults = () => {
        setLimit(musicInfo.length);
    };
 
        const fetchData = async (id) => {
            try {
                const options = {
                    method: 'GET',
                    url: 'http://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/search/songs',
                    params: { query:id }
                };
                const res = await axios.request(options);
                console.log(res)
                setSongid(res.data.data.results[0].id)
                   
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
     
   

    useEffect(() => {
        const fetchData = async () => {
            try {
                const options = {
                    method: 'GET',
                    url: 'http://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/search/albums',
                    params: {query: 'Bollywood'}
                  };
                const res = await axios.request(options);
            
                setMusicInfo(res.data.data.results.map((song) => ({
                    id: song.id,
                    name: song.name,
                    image: song.image[1],
                    
                })));
                setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [names]);
 
    const play = (id) => {
       fetchData(id);
    };

    return (
        <>
         {!loading?(
        <div className='flex p-4 flex-3 gap-5 mb-12 cursor-pointer'>
           
            <div className="flex flex-wrap">
            {isAboveMedium ? (
    <>
        {musicInfo.slice(0, limit).map((song) => (
            <div className="h-68 border-1 bg-deep-grey w-56 text-white mr-5 border-0 rounded-md p-4 mt-5" key={song.id} onClick={() => play(song.name)}>
                <img src={song.image.url} alt={song.title} className="h-48 w-56 object-cover border-0 rounded-md" />
                <h1 className="text-center font-bold text-white">{song.name}</h1>
            </div>
        ))}
        {musicInfo.length > 5 && limit === 5 ? (
            <button onClick={expandResults}><img src={viewall} /><h1 className='font-bold'> View All</h1></button>
        ) : (
            <button onClick={() => setLimit(5)}><img src={viewclose} /><h1 className='font-bold'>Close</h1></button>
        )}
    </>
) : (
    musicInfo.slice(0, 3).map((song) => (
        <div className="flex flex-col items-center" key={song.id} onClick={() => play(song.name)}>
            <div className="h-24 border-1 bg-deep-grey w-24 text-white mr-5 border-0 rounded-md  mt-2">
                <img src={song.image.url} alt={song.title} className="h-24 w-24 object-cover border-0 rounded-md" />
            </div>
        </div>
    ))
)}

            </div>
          
        </div>
          )
        :(
            <span className='text-red text-3xl font-bold'>Loading.....</span>
        )}
        </>
    );
}

export default Albums;
