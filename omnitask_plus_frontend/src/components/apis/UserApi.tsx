import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/users';

// Function to get the authorization token
const getAuthToken = (): string | null => {
  const token = sessionStorage.getItem('accessToken');
  return token;
};

// Enhanced Axios instance with base configurations
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the Authorization token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API call to fetch user's data by ID
const getUserData = async (userId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/getuser/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API call to fetch all users
const getAllUsers = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/getusers`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API call to fetch a user by username or email
const getUserByUsernameOrEmail = async (username?: string, email?: string): Promise<any> => {
  try {
    const response = await axiosInstance.get('/', {
      params: { username, email },
    });
    // console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API call to update user's data
const updateUserData = async (userId: string, userData: any): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/update/${userId}`, {...userData});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// // API call to update user's profile image
// const updateUserImage = async (userId: string, imageBase64: string): Promise<any> => {
//   try {
//     const response = await axiosInstance.post(`/update_user_image`, {
//       user_id: userId,
//       image: imageBase64,
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// const isUserOnline = async (userId: string): Promise<boolean> => {
//   // Implementation depends on how your backend determines online status
//   // This is a placeholder example
//   try {
//     const response = await fetch(`/api/users/${userId}/online-status`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const { online } = await response.json();
//     return online;
//   } catch (error) {
//     console.error('Failed to fetch user online status:', error);
//     return false;
//   }
// };

export {  getUserData, getAllUsers, getUserByUsernameOrEmail, updateUserData };

