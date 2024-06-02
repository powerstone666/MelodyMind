import React,{useState} from 'react';
import useMediaQuery from '../useMedia';
import Swipe from '../components/swipe';
import Topsongs from './topsong';
import Newrelease from './newrelease';
import Trending from '../Trendy/trending';
function Home(){
    const isAboveMedium=useMediaQuery('(min-width:768px)');

return(
    <>
    {isAboveMedium ?(
        <div className='overflow-y h-screen w-full' style={{overflowX:"scroll"}}>
     <Swipe/>
     <h1 className='text-3xl p-4 m-5'>Weekly Top <span className="text-red font-bold">Songs</span></h1>
       <Topsongs/>
       <h1 className='text-3xl p-4 m-5'>New Releases <span className="text-red font-bold">Songs</span></h1>
       <Newrelease/>
       <h1 className='text-3xl p-4 m-5'>Trending <span className="text-red font-bold">Songs</span></h1>
       <Trending/>
     </div>
    ):(
        <div className='overflow-y h-screen w-full' style={{overflowX:"scroll"}}>
    
        <h1 className='text-xl p-2 m-0'>Weekly Top <span className="text-red font-bold">Songs</span> </h1>

          <Topsongs/>
          <h1 className='text-xl p-2 m-0'>New Releases <span className="text-red font-bold">Songs</span></h1>
       <Newrelease/>
       <h1 className='text-xl p-2 m-0'>Trending <span className="text-red font-bold">Songs</span></h1>
       <Topsongs names={"trending songs 2024"}/>
       <div className='h-2/6'>

       </div>
        </div>
    )
}
    </>
)
}
export default Home;