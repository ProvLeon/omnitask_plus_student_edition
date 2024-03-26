import axios from 'axios';

const BASE_URL = 'http://localhost:5000/tasks';

// Function to get the authorization token
const getAuthToken = () => {
  const token = localStorage.getItem('accessToken');
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

// API call to fetch tasks
const getTasks = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to convert file to Base64
const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

interface TaskData {
  [key: string]: any; // Allows any property with string key
  media?: string; // Changed type to string to store Base64 encoded string
}

// Additional API calls based on task_routes.py and TaskForm.tsx
const createTask = async (taskData: TaskData) => {
  try {
    // Check if taskData contains a file for media and convert it to Base64
    if (taskData['media'] && (taskData['media'] as any) instanceof File) {
      const mediaBase64 = await toBase64(taskData['media'] as unknown as File);
      taskData['media'] = mediaBase64;
    }
    const response = await axiosInstance.post('/', taskData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateTask = async (taskId: string, taskData: TaskData) => {
  try {
    // Check if taskData contains a file for media and convert it to Base64
    if (taskData['media'] && (taskData['media'] as any) instanceof File) {
      const mediaBase64 = await toBase64(taskData['media'] as unknown as File);
      taskData['media'] = mediaBase64;
    }
    const response = await axiosInstance.put(`/${taskId}`, taskData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (taskId: string) => {
  try {
    const response = await axiosInstance.delete(`/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getTasks, createTask, updateTask, deleteTask };
