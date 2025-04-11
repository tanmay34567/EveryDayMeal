import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppcontext } from '../context/Appcontext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { Student, seller } = useAppcontext();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Short timeout to ensure the auth state is fully loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // While checking auth state, show nothing (or a loading spinner)
  if (isLoading) {
    return null; // or return <LoadingSpinner /> if you have one
  }
  
  // Check if the user has the required role
  const isAuthenticated = () => {
    if (requiredRole === 'student') return !!Student;
    if (requiredRole === 'vendor') return !!seller;
    return !!Student || !!seller;
  };

  // If not authenticated, redirect to home
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // If authenticated with correct role, render the children components
  return children;
};

export default ProtectedRoute;