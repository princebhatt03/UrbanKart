import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');

  return adminToken ? (
    children
  ) : (
    <Navigate
      to="/adminLogin"
      replace
    />
  );
};

export default AdminProtectedRoute;
