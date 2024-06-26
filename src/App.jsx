import Landing from "./landing"
import React, {useContext, useEffect, useState} from "react"
import Sidebar from "./navbar/sidebar"
import { Context } from "./main"
import { useNavigate } from 'react-router-dom';
function App() {
const {selected,setSelected}=useContext(Context)
const Navigate=useNavigate();
useEffect(() => {
const last=localStorage.getItem("selected")||"/";
if(last)
  {
   Navigate(last);
  }

}
, [])
  return (
    <>
     <div className="flex">
      <Sidebar />
      <Landing/>
     </div>
   
     </>
  )
}

export default App
