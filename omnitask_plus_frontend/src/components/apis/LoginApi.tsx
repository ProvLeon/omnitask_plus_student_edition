import axios from 'axios';
import { connectUser } from './ChatApi';

const BASE_URL = import.meta.env.VITE_BACKEND_URL +'/api'
// Function to login and receive access and refresh tokens
const loginUser = async (credentials: { username: string; password: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, JSON.stringify(credentials), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Assuming the response includes both accessToken and refreshToken
    const { access_token, refresh_token, user_id, chat_token } = response.data;
    sessionStorage.setItem('accessToken', access_token);
    sessionStorage.setItem('refreshToken', refresh_token);
    // Store user ID in a session storage to maintain the user's session state
    sessionStorage.setItem('userId', user_id);
    sessionStorage.setItem('chatToken', chat_token);
    console.log("Chat Token:", chat_token);
    // Automatically start user session upon successful login
    if (sessionStorage.getItem('chatToken') && location.pathname === '/chat') {
      console.log("Connecting user...")
      const user = await connectUser();
      console.log(user)
      console.log("User connected successfully.")
    }
    // await startUserSession(user_id);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = sessionStorage.getItem('refreshToken');
    const response = await axios.post(`${BASE_URL}/token/refresh`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });
    console.log(refreshToken)
    const { accessToken } = response.data;
    sessionStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

// Function to automatically start user session
// const startUserSession = async (userId: string) => {
//   try {
//     await axios.post(`${BASE_URL}/users/${userId}/start-session`);
//   } catch (error) {
//     console.error('Error starting user session:', error);
//   }
// };

// Function to automatically end user session
// const endUserSession = async (userId: string) => {
//   try {
//     await axios.post(`${BASE_URL}/users/${userId}/end-session`);
//   } catch (error) {
//     console.error('Error ending user session:', error);
//   }
// };

// Function to check if user is online
// const isUserOnline = async (userId: string) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/users/${userId}/online-status`);
//     return response.data.online;
//   } catch (error) {
//     console.error('Error checking if user is online:', error);
//     return false;
//   }
// };

// Axios interceptor to handle token refresh automatically
axios.interceptors.response.use(response => response, async error => {
  // Check if the current URL is the login, register, or forgot-password page
  if (window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/forgot-password') {
    // If on the login page, do not attempt to refresh the token
    return Promise.reject(error);
  }

  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      // Redirect to login if refresh token is invalid or expired
      // const userId = sessionStorage.getItem('userId');
      // if (userId) {
      //   await endUserSession(userId);
      // }
      window.location.href = '/login';
      return Promise.reject(error);
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    originalRequest.headers['Content-Type'] = 'application/json'; // Ensure JSON content type is set for retry requests
    return axios(originalRequest);
  }
  return Promise.reject(error);
});

export { loginUser, refreshAccessToken };
