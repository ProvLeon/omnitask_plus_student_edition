import axios from 'axios';
import { connectUser } from './ChatApi';
import { Navigate } from 'react-router-dom';

// Base URL for backend API, fetched from environment variables
const BASE_URL = import.meta.env.VITE_BACKEND_URL +'/api'

/**
 * Function to login and receive access and refresh tokens.
 * @param credentials Object containing username and password.
 * @returns void
 */
const loginUser = async (credentials: { username: string; password: string }) => {
  try {
    // Sending a POST request to the login endpoint with the user's credentials
    const response = await axios.post(`${BASE_URL}/login`, JSON.stringify(credentials), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Destructuring the response to extract necessary tokens and user information
    const { access_token, refresh_token, user_id, chat_token } = response.data;
    // Storing tokens and user information in session storage for later use
    sessionStorage.setItem('accessToken', access_token);
    sessionStorage.setItem('refreshToken', refresh_token);
    sessionStorage.setItem('userId', user_id);
    sessionStorage.setItem('chatToken', chat_token);

    // If a chat token exists and the current path is '/chat', connect the user
    if (sessionStorage.getItem('chatToken') && location.pathname === '/chat') {
      console.log("Connecting user...")
      const user = await connectUser();
      console.log(user)
      console.log("User connected successfully.")
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Function to refresh the access token using the refresh token.
 * @returns accessToken or redirects to login page.
 */
const refreshAccessToken = async () => {
  try {
    // Retrieving the refresh token from session storage
    const refreshToken = sessionStorage.getItem('refreshToken');
    // Sending a POST request to the token refresh endpoint
    const response = await axios.post(`${BASE_URL}/token/refresh`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });
    const { accessToken } = response.data;
    // Updating the access token in session storage
    sessionStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    // Redirecting to login page upon failure to refresh the access token
    return <Navigate to="/login" state={{ from: "location" }} />
  }
};

// Axios interceptor to handle token refresh automatically upon receiving a 401 status code
axios.interceptors.response.use(response => response, async error => {
  // Check if the current URL is the login, register, or forgot-password page
  if (window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/forgot-password') {
    // If on the login page, do not attempt to refresh the token
    return Promise.reject(error);
  }

  const originalRequest = error.config;
  // Attempting token refresh only once per request to avoid infinite loops
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      // Redirect to login if refresh token is invalid or expired
      window.location.href = '/login';
      return Promise.reject(error);
    }
    // Updating the authorization header with the new access token
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    originalRequest.headers['Content-Type'] = 'application/json'; // Ensure JSON content type is set for retry requests
    return axios(originalRequest);
  }
  return Promise.reject(error);
});

// Exporting the loginUser and refreshAccessToken functions for use in other parts of the application
export { loginUser, refreshAccessToken };
