import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    }
  }, [navigate]);

  return children; // Only show the children if authenticated (i.e., token exists)
};

export default ProtectedRoute;
