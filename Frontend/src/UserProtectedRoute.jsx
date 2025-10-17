import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  const user = localStorage.getItem('userInfo');

  return token || user ? (
    children
  ) : (
    <Navigate
      to="/userLogin"
      replace
    />
  );
};

export default ProtectedRoute;
