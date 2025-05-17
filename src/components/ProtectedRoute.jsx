import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Context } from '../context';

function ProtectedRoute() {
  const { Users } = useContext(Context);
  
  // If user is not logged in, redirect to login page
  if (!Users) {
    return <Navigate to="/login" />;
  }
  
  // If user is logged in, render the outlet (child routes)
  return <Outlet />;
}

export default ProtectedRoute;
