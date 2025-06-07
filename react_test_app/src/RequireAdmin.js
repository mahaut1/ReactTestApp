import { Navigate } from 'react-router-dom';
import React from 'react';

const RequireAdmin = ({ children }) => {
const isAdmin = localStorage.getItem('isAdmin') === 'true' ? true : false;
  console.log('RequireAdmin isAdmin:', isAdmin);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
