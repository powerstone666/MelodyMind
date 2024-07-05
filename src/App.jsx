import React, { useContext, useEffect } from "react";
import addNotification from 'react-push-notification';
import { Notifications } from 'react-push-notification';
import Sidebar from "./navbar/sidebar";
import { Context } from "./main";
import { useNavigate, useLocation } from 'react-router-dom';
import Landing from "./landing"
import "./App.css";
function App() {
  const { setSelected } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      addNotification({
        title: 'Updates Under Way',
        subtitle: 'updates under way',
        message: 'Recommendations are under optimisation u may miss spotify recommendation for a day till that u can enjoy our v1',
        theme: 'darkblue',
        native: true // when using native, your OS will handle theming.
    });
    }, 1*60*60*1000); // Send notification every 5 seconds (5000 milliseconds)

    return () => clearInterval(notificationInterval);
  }, [])



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
