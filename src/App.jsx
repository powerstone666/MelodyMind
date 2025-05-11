import React, { useContext, useEffect } from "react";
import Sidebar from "./navbar/sidebar";
import { Context } from "./context.js"; // Import Context from separate file
import { useNavigate, useLocation } from 'react-router-dom';
import Landing from "./landing";
import "./App.css";

function App() { // Remove all props
  const { selected, setSelected } = useContext(Context); // Get both selected and setSelected from Context
  const navigate = useNavigate();
  const location = useLocation();
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
