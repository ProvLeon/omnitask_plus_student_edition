import axios from 'axios';

// Base URL for user-related API endpoints, constructed from environment variables
const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/users';

// Retrieves the authorization token from session storage
const getAuthToken = (): string | null => {
  const token = sessionStorage.getItem('accessToken');
  return token;
};

// Creates an Axios instance with predefined base URL and headers
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adds an interceptor to Axios instance to inject the Authorization token into headers of every request
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Fetches user data by user ID
const getUserData = async (userId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/getuser/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetches data for all users
const getAllUsers = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/getusers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetches a user by username or email
const getUserByUsernameOrEmail = async (username?: string, email?: string): Promise<any> => {
  try {
    const response = await axiosInstance.get('/', {
      params: { username, email },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Updates user data for a given user ID
const updateUserData = async (userId: string, userData: any): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/update/${userId}`, {...userData});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getUserData, getAllUsers, getUserByUsernameOrEmail, updateUserData };

