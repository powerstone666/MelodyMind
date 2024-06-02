import React,{useState} from 'react';
import useMediaQuery from '../useMedia';
import Swipe from '../components/swipe';
import Topsongs from './topsong';
import Newrelease from './newrelease';
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
     </div>
    ):(
        <div className='overflow-y h-screen w-full' style={{overflowX:"scroll"}}>
    
        <h1 className='text-xl p-2 m-0'>Weekly Top <span className="text-red font-bold">Songs</span> </h1>

          <Topsongs/>
          <h1 className='text-xl p-2 m-0'>New Releases <span className="text-red font-bold">Songs</span></h1>
       <Newrelease/>
        </div>
    )
}
    </>
)
}
export default Home;