import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import Loading from '../SmallComponents/Loading'; // Import Loading component for displaying loading state

// Retrieve the base URL from environment variables
const BASE_URL = import.meta.env.VITE_BACKEND_URL

// Function to check if the user is authenticated by validating the access token
const isAuthenticated = async () => {
  // Retrieve the access token from session storage
  const token = sessionStorage.getItem('accessToken');
  // If no token is found, return false indicating the user is not authenticated
  if (!token) return false;
  try {
    // Make a POST request to validate the token
    const response = await axios.post(`${BASE_URL}/api/validatetoken`, {}, {
      headers: {
        Authorization: `Bearer ${token}` // Set the Authorization header with the token
      }
    });
    // Return the validity of the token based on the response
    return response.data.isValid;
  } catch (error) {
    // Log any errors during token validation
    console.error('Token validation error:', error);
    return false;
  }
};

// Define the props for the AuthRoute component
interface AuthRouteProps {
  element: React.ReactElement;
}

// AuthRoute component to protect routes that require authentication
const AuthRoute = ({ element: Component }: AuthRouteProps) => {
  // State to keep track of the authentication status
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // Function to check the authentication status of the user
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      setIsAuth(authStatus); // Update the state based on the authentication status
    };
    checkAuth(); // Call the function to check authentication status
  }, []);

  // If the authentication status is still being checked, display the Loading component
  if (isAuth === null) {
    return <Loading/>;
  }

  // If authenticated, render the requested component; otherwise, redirect to the login page
  return isAuth ? Component : <Navigate to="/login" state={{ from: "location" }} />;
};

export default AuthRoute;
