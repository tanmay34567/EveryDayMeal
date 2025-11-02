import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppcontext } from '../context/Appcontext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { Student, seller } = useAppcontext();
  
  // Check if user is authenticated based on the required role
  // Also verify token exists to ensure valid session
  const isAuthenticated = 
    (requiredRole === 'student' && Student && Student.token) || 
    (requiredRole === 'vendor' && seller && seller.token);
  
  if (!isAuthenticated) {
    // Redirect to home if not authenticated with the required role
    return <Navigate to="/" replace />;
  }
  
  // If authenticated with the correct role, render the protected component
  return children;
};

export default ProtectedRoute;