import Landing from "./landing"
import React, {useState} from "react"
import Sidebar from "./navbar/sidebar"


function App() {


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
