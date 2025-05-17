import React, { useContext, useEffect } from "react";
import Sidebar from "./navbar/sidebar";
import { Context } from "./context.js";
import { useNavigate, useLocation } from 'react-router-dom';
import Landing from "./landing";
import "./App.css";
import { validateAndRefreshToken } from "./Firebase/auth";

function App() {
  const { selected, setSelected, Users, setUsers } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle path selection and localStorage
  useEffect(() => {
    // Initialize 'selected' state from localStorage on first mount
    const lastSelected = localStorage.getItem("selected") || "/";
    setSelected(lastSelected);

    // Navigate to the last selected path only if not already on a path
    if (location.pathname === "/") {
      navigate(lastSelected);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update 'selected' state and localStorage whenever location changes
    setSelected(location.pathname);
    localStorage.setItem("selected", location.pathname);
  }, [location.pathname, setSelected]);

  // Check token on startup
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        // Only run if there's user data in context
        if (Users) {
          // Validate and refresh token if needed
          const userData = await validateAndRefreshToken();
          if (!userData) {
            // Token invalid or refresh failed
            setUsers("");
            if (
              location.pathname === "/liked" || 
              location.pathname === "/recently"
            ) {
              navigate("/login");
            }
          }
        }
      } catch (error) {
        console.error("Initial auth check error:", error);
      }
    };

    checkInitialAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex">
        <Sidebar />
        <Landing />
      </div>
    </>
  );
}

export default App;
