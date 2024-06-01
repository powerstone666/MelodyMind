import Landing from "./landing"
import React, {useState} from "react"
import Sidebar from "./navbar/sidebar"


function App() {
 const[selected, setSelected] = useState('home')
const [songid,setSongid]=useState(null);
  return (
    <>
     <div className="flex">
      <Sidebar selected={selected} setSelected={setSelected}/>
      <Landing selected={selected} setSelected={setSelected}/>
     </div>
   
     </>
  )
}

export default App
