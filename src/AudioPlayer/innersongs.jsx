import React, { useContext, useEffect,useState } from 'react';
import { Context } from '../main';
import useMediaQuery from '../useMedia';
import { searchResult, searchSuggestion, songLyrics } from '../saavnapi';
import he from 'he';
function Innersongs() {
    const isAboveMedium = useMediaQuery("(min-width: 768px)");
    const { songid, lyrics, setLyrics,setSongid } = useContext(Context);
    const [details, setDetails] = useState("");
    const [image,setimage]=useState("");
    const [songName,setSongName]=useState("")
    const [midsection,setMidsection]=useState("song")
    const [recomendation,setRecomendation]=useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchLyrics = async () => {
            setLoading(false)
            if (songid) {
                try{
                const res = await searchResult(songid);
                setDetails(res.data.data[0]);
               const new2=he.decode(res.data.data[0].name);
               
                setSongName(new2)
                setimage(res.data.data[0].image[2].url);
                }catch(error){
                    console.error(error)
                }
            try{
            const res2=await songLyrics(songid);
               const decodedRes=he.decode(res2.data.lyrics)
               setLyrics(decodedRes)
            }
            catch(error){
                setLyrics("Lyrics Not found")
             }
             try{
               const res3=await searchSuggestion(songid);
               setRecomendation(res3.data)
               setRecomendation(
                res3.data.map((song) => ({
                  id: song.id,
                  name: he.decode(song.name),
                  image: song.image[1].url,
                  artist: song.artists.primary[0].name,
                  year: song.year,
                }))
            );
            }
            catch(error){
                 console.error("Error fetching data:", error);
             }
            }
            setLoading(true)
        };
        fetchLyrics();
    }, [songid, setLyrics]);
    const play = async (id) => {
         const a = localStorage.setItem("songid", id);
        setSongid(id);
      };
     const style=`text-white bg-red  border-0 rounded-xl`
    return (
        <>
        {loading ? (
        <div className="flex flex-col items-center h-screen overflow-y-scroll mb-24">
            {isAboveMedium ? (
                <>
                <div className='border-1 bg-deep-grey h-1/2  mb-6 p-4 '>
                  <img src={image} alt="song" className=" h-full" />
                  </div>
                  <h1 className='text-xl mb-6'>{songName}</h1>
                  <div className='h-14 bg-deep-grey flex justify-center  w-96 border-0 rounded-xl items-center mb-8' >
                        <div className={`${midsection==="song"?style:""} w-1/2  h-full p-4 flex justify-center   cursor-pointer`} onClick={()=>setMidsection("song")}>
                            <h1>Song</h1></div>
                        <div className={`${midsection==="lyric"?style:""} w-1/2 p-4 flex justify-center   cursor-pointer `} onClick={()=>setMidsection("lyric")}>
                            <h1>Lyrics</h1>
                            </div>
                  </div>
                  {midsection==="song"&&(
                    <div className=''>
                          {recomendation.slice(0, recomendation.length).map((song, index) => (
                <div
                  className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <h1 className="text-2xl w-12">#{index + 1}</h1>{" "}
                  {/* Fixed width for index */}
                  <img src={song.image} className="h-12" />{" "}
                  {/* Keep image size fixed */}
                  <h1 className="text-md flex-grow">{song.year}</h1>{" "}
                  {/* Allow year to take remaining space */}
                  <h1 className="text-md flex-grow">{song.name}</h1>
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/9376/9376391.png"
                    className="h-12"
                  />{" "}
                  {/* Keep image size fixed */}
                </div>
              ))}
                    </div>
                  )
                  }
                  {midsection==="lyric"&&(
                    <div>
                        <h1 className='text-3xl mb-2'>Movie:{''}{' '}<span className='text-red'>{he.decode(details.name)}</span></h1>
                        <h1 className='text-3xl mb-4'>Year:{''}{' '}<span className='text-red'>{details.year}</span></h1>
                        <h1 className='text-xl' dangerouslySetInnerHTML={{ __html: lyrics ? lyrics : "Lyrics Not found" }}/>
                    </div>
                  )
                  }
                </>
            ) : (
                <>
                <div className='border-1 bg-deep-grey h-2/6  mb-6 p-4 flex-col'>
                  <img src={image} alt="song" className=" h-full" />
                  </div>
                  <h1 className='text-xl mb-6'>{songName}</h1>
                  <div className='h-14 bg-deep-grey flex justify-center  w-56 border-0 rounded-xl items-center mb-8' >
                        <div className={`${midsection==="song"?style:""} w-1/2  h-full p-4 flex justify-center   cursor-pointer`} onClick={()=>setMidsection("song")}>
                            <h1>Song</h1></div>
                        <div className={`${midsection==="lyric"?style:""} w-1/2 p-4 flex justify-center   cursor-pointer `} onClick={()=>setMidsection("lyric")}>
                            <h1>Lyrics</h1>
                            </div>
                  </div>
                  {midsection==="song"&&(
                    <div className='mb-36'>
                          {recomendation.slice(0, recomendation.length).map((song, index) => (
                <div
                  className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <h1 className="text-sm w-12">#{index + 1}</h1>{" "}
                  {/* Fixed width for index */}
                  <img src={song.image} className="h-12" />{" "}
                  {/* Keep image size fixed */}
                  <h1 className="text-sm flex-grow">{song.year}</h1>{" "}
                  {/* Allow year to take remaining space */}
                  <h1 className="text-sm flex-grow">{song.name}</h1>
                
                </div>
              ))}
                    </div>
                  )
                  }
                  {midsection==="lyric"&&(
                    <div className='mb-36'>
                        <h1 className='text-xl mb-2'>Movie:{''}{' '}<span className='text-red'>{he.decode(details.name)}</span></h1>
                        <h1 className='text-xl mb-4'>Year:{''}{' '}<span className='text-red'>{details.year}</span></h1>
                        <h1 className='text-md flex-wrap' dangerouslySetInnerHTML={{ __html: lyrics ? lyrics : "Lyrics Not found" }}/>
                    </div>
                  )
                  }
              
                </>
            )}
        </div>
        ):(
            <h1 className='text-2xl text-red'>Loading....</h1>
        )
         }
         </> )
         ;
}

export default Innersongs;
