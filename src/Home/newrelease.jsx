import React,{useState} from 'react';
import useMediaQuery from '../useMedia';
import Topsongs from './topsong';
function Newrelease(){
    const isAboveMedium=useMediaQuery('(min-width:768px)');
  return (
    <>
    {isAboveMedium ?(
        <div className='overflow-y h-screen w-full' style={{overflowX:"scroll"}}>
       <Topsongs names={"hindi2024"}/>
       
     </div>
    ):(
        <div className='overflow-y h-screen w-full' style={{overflowX:"scroll"}}>
    
      

          <Topsongs names={"hindi2024"}/>
          
        </div>
    )
}
    </>
  );
}
export default Newrelease;