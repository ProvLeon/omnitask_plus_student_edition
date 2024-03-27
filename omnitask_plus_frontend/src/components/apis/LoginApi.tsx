import axios from 'axios';

const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL +'/api'

// Function to login and receive access and refresh tokens
const loginUser = async (credentials: { username: string; password: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, JSON.stringify(credentials), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Assuming the response includes both accessToken and refreshToken
    const { access_token, refresh_token, user_id } = response.data;
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    localStorage.setItem('userId', user_id)
    // console.log("Access Token:", access_token);
    // console.log("Refresh Token:", refresh_token);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(`${BASE_URL}/token/refresh`, JSON.stringify({ refreshToken }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

// Axios interceptor to handle token refresh automatically
axios.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const newAccessToken = await refreshAccessToken();
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    originalRequest.headers['Content-Type'] = 'application/json'; // Ensure JSON content type is set for retry requests
    return axios(originalRequest);
  }
  return Promise.reject(error);
});

export { loginUser, refreshAccessToken };
