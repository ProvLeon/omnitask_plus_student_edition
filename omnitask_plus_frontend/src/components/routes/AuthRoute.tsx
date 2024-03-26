import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios'; // Assuming axios is used for HTTP requests


const BASE_URL = import.meta.env.REACT_APP_BASE_URL

const isAuthenticated = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  try {
    // Ensure axios is configured to send the Authorization header correctly
    const response = await axios.post(`${BASE_URL}/api/validatetoken`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // console.log(token)
    return response.data.isValid;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

interface AuthRouteProps {
  element: React.ReactElement;
}

const AuthRoute = ({ element: Component }: AuthRouteProps) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setIsAuth(authStatus);
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return isAuth ? Component : <Navigate to="/login" state={{ from: "location" }} />;
};

export default AuthRoute;
