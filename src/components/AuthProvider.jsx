import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import { validateAndRefreshToken } from '../Firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000; // Check token every 5 minutes

function AuthProvider({ children }) {
  const { Users, setUsers } = useContext(Context);
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to validate the current token
  const checkAuthStatus = async () => {
    try {
      const userData = await validateAndRefreshToken();
      
      if (!userData) {
        // Token is invalid or expired and could not be refreshed
        if (Users) {
          // Only show logout message if user was previously logged in
          toast.info("Your session has expired. Please sign in again.");
          setUsers("");
          navigate('/login');
        }
      } else {
        // Update user data with refreshed token
        setUsers(userData);
      }
    } catch (error) {
      console.error("Auth validation error:", error);
      // On any error, log the user out for security
      setUsers("");
      navigate('/login');
    } finally {
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  };

  // On component mount, check auth status
  useEffect(() => {
    checkAuthStatus();
    
    // Set up interval to periodically check token validity
    const interval = setInterval(checkAuthStatus, TOKEN_CHECK_INTERVAL);
    
    // Clean up on unmount
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When not yet initialized, return a loading state
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-deep-grey to-deep-blue">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-melody-pink-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-white font-medium">Loading MelodyMind...</p>
        </div>
        <ToastContainer 
          position="top-center"
          theme="dark"
        />
      </div>
    );
  }

  return (
    <>
      {children}
      <ToastContainer 
        position="top-center"
        theme="dark"
      />
    </>
  );
}

export default AuthProvider;
