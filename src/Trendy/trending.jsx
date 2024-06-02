import axios from 'axios';
import viewall from '../assets/viewall.svg';
import viewclose from '../assets/viewclose.svg';
import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { Context } from '../main';
import useMediaQuery from '../useMedia';

function Trending({names}) {
    const { setSongid } = useContext(Context);
    const [musicInfo, setMusicInfo] = useState([]);
    const [limit, setLimit] = useState(5);
    const isAboveMedium = useMediaQuery('(min-width:768px)');
    const [loading,setLoading]=useState(true)
    // Function to handle expanding to show more results
    const expandResults = () => {
        setLimit(musicInfo.length);
    };
    const formatDuration = (durationInSeconds) => {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const options = {
                    method: 'GET',
                    url: 'http://jiosaavn-olj6ym1v4-thesumitkolhe.vercel.app/api/search/songs',
                    params: { query: names?names:"trending songs 2024" }
                };
                const res = await axios.request(options);
              
                setMusicInfo(res.data.data.results.map((song) => ({
                    id: song.id,
                    name: song.name,
                    image: song.image[1],
                    duration:formatDuration(song.duration),
                    album:song.album.name,
                    year:song.year
                })));
             setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [names?names:""]);

    const play = (id) => {
        setSongid(id);
    };

    return (
        <>
        {!loading ? (
        <>
        {isAboveMedium?(
        <div className=' h-full  flex flex-col '>
      {musicInfo.slice(0, limit).map((song, index) => (
    <div className='w-4/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer' key={song.id}  onClick={()=>play(song.id)}>
        <h1 className='text-2xl w-12'>#{index + 1}</h1> {/* Fixed width for index */}
        <img src={song.image.url} className='h-12'/> {/* Keep image size fixed */}
        <h1 className='text-md flex-grow'>{song.year}</h1> {/* Allow year to take remaining space */}
        <h1 className='text-md flex-grow'>{song.album}</h1> {/* Allow album to take remaining space */}
        <h1 className='text-md w-16'>{song.duration}</h1> {/* Fixed width for duration */}
        <img src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png" className='h-12'/> {/* Keep image size fixed */}
    </div>
))}
        <div className="flex  ml-8">
        {musicInfo.length > 5 && limit === 5 ? (
            <button onClick={expandResults} className='bg-deep-grey w-32 h-12 p-2'>
                <h1 className='font-bold mb-24'> View All</h1>
            </button>
        ) : (
            <button onClick={() => setLimit(5)} className='bg-deep-grey w-32 h-12 p-2'>
                <h1 className='font-bold mb-24'>View Less</h1>
            </button>
        )}
    </div>
    </div>
        ):
        (
            <div className='grid grid-cols-3 p-4'>
            {musicInfo.slice(0, musicInfo.length).map((song) => (
                <div className="flex items-center" key={song.id} onClick={() => play(song.id)}>
                    <div className="h-24 border-1 bg-deep-grey w-24 text-white  border-0 rounded-md mt-2 flex">
                        <img src={song.image.url} alt={song.title} className="h-24 w-24 object-cover border-0 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
        
        )
    }
    </>
    ):(
        <span className='text-red text-3xl font-bold'>Loading.....</span>
    )}
    </>
    );
}

export default Trending;
