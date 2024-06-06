import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createContext } from 'react'

export const Context = createContext();

 const Appwrapper=()=>{
  const [songid,setSongid]=useState(localStorage.getItem("songid")||"");
  const [search,setSearch]=useState(null);
  const [singer,setSinger]=useState(null);
  return(
    <Context.Provider value={{songid,setSongid,search,setSearch}}>
    <App songid={songid} setSongid={setSongid} search={search} setSearch={setSearch} singer={singer} setSinger={setSinger}/>
    </Context.Provider>
  )
}
  
ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <Appwrapper />
  </React.StrictMode>,
)
