import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-black">Loading...</div>;

  if (!token) {
    return <Navigate to="/be3dol/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;

