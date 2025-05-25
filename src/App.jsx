import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./navbar/sidebar";
import { Context } from "./context.js";
import { useNavigate, useLocation } from 'react-router-dom';
import Landing from "./landing";
import "./App.css";
import { validateAndRefreshToken, logoutUser } from "./Firebase/auth"; // Import logoutUser
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { auth } from "./Firebase/firebaseConfig"; // Import auth

function App() {
  const { selected, setSelected, Users, setUsers } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Hide loader on component mount
  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }, []);

  // Robust online/offline status detection
  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online');
      setIsOffline(false);
    };
    const handleOffline = () => {
      console.log('App is offline');
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
        // Check for login timestamp and enforce 30-day logout
        const loginTimestamp = localStorage.getItem('loginTimestamp');
        if (loginTimestamp) {
          const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;
          if (Date.now() - parseInt(loginTimestamp, 10) > thirtyDaysInMillis) {
            await logoutUser();
            setUsers("");
            navigate("/login");
            alert("You have been logged out due to inactivity."); // Or use a toast notification
            return; // Stop further auth checks if logged out
          }
        }

        // Only run if there's user data in context or localStorage
        const storedUser = localStorage.getItem("Users");
        if (Users || storedUser) {
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

  // Add this useEffect to hide the loader once the initial user check is done
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Check and set login timestamp
      if (currentUser) {
        const loginTimestamp = localStorage.getItem('loginTimestamp');
        if (!loginTimestamp) {
          localStorage.setItem('loginTimestamp', Date.now().toString()); // Ensure it's a string
        }
      } else {
        localStorage.removeItem('loginTimestamp');
      }
      setLoading(false); // Stop loading once auth state is determined
      const loader = document.getElementById('loader');
      if (loader) {
        loader.style.display = 'none';
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Optionally, you can return a more integrated React-based loader here
    // instead of relying solely on the HTML one, but the HTML one covers the initial load.
    return null; // Or your React loader component if you prefer
  }

  return (
    <>
      {isOffline && (
        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#ffc107', color: 'black' }}>
          You are currently offline. Some features may be limited.
        </div>
      )}
      <div className="flex">
        <Sidebar />
        <Landing />
      </div>
    </>
  );
}

export default App;
