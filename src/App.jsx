import React, { useContext, useEffect,useState } from "react";
import Sidebar from "./navbar/sidebar";
import { Context } from "./main";
import { useNavigate, useLocation } from 'react-router-dom';
import Landing from "./landing"
import "./App.css";
import OneSignal from 'react-onesignal';

function App() {
  const { setSelected } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  //Example2
  const [initialized, setInitialized] = useState(false);
  OneSignal.init({ appId: 'd6a22656-474f-40ac-9aec-82e657ee310e' }).then(() => {
    setInitialized(true);
    OneSignal.Slidedown.promptPush();
    // do other stuff
  })
  useEffect(() => {
    // Initialize 'selected' state from localStorage on first mount
    const lastSelected = localStorage.getItem("selected") || "/";
    setSelected(lastSelected);

    // Navigate to the last selected path from localStorage
    navigate(lastSelected);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Update 'selected' state and localStorage whenever location changes
    setSelected(location.pathname);
    localStorage.setItem("selected", location.pathname);
  }, [location.pathname, setSelected]);



  return (
    <>
     <div className="flex">
      <Sidebar />
      <Landing />
     </div>
   
     </>
  )
}

export default App
