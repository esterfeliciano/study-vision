import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>; // Ou algum componente de loading
  }

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
