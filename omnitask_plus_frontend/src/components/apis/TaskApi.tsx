import axios from 'axios';
import { fileToBase64 } from '../../utils/utils';
import { User } from '../Tasks/TaskForm';

// Base URL for the backend tasks endpoint.
const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/tasks';

// Function to retrieve the authentication token from session storage
const getAuthToken = (): string | null => {
  const token = sessionStorage.getItem('accessToken');
  return token;
};

// Creating an axios instance with default configurations for making HTTP requests to the backend
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adding a request interceptor to axios instance to inject the Authorization header into every request
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Function to fetch all tasks from the backend
const getTasks = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/');
    // Ensure response.data is an array before mapping
    const tasks = Array.isArray(response.data) ? response.data.map((task: any) => task) : [];
    return tasks;
  } catch (error) {
    throw error;
  }
};

// Interface for task data structure
interface TaskData {
  [key: string]: any;
  media?: File | string | null;
  persons_responsible?:  User[];
}

// Function to create a new task in the backend
const createTask = async (taskData: TaskData): Promise<any> => {
  // Convert media file to base64 if it exists
  if (taskData.media && (taskData.media instanceof File)) {
    taskData.media = await fileToBase64(taskData.media as File);
  }

  try {
    const response = await axiosInstance.post('/', taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to update an existing task in the backend
const updateTask = async (taskId: string, taskData: TaskData): Promise<any> => {
  // Convert media file to base64 if it exists
  if (taskData.media && (taskData.media instanceof File)) {
    taskData.media = await fileToBase64(taskData.media as File);
  }

  try {
    const response = await axiosInstance.put(`/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to delete a task from the backend
const deleteTask = async (taskId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to update the status of a task
const updateTaskStatus = async (taskId: string, status: string): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/${taskId}/status`, { status: status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to update a specific attribute of a task
const updateTaskAttribute = async (taskId: string, attribute: string, value: any): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/${taskId}/${attribute}`, { value: value });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to fetch activity trends data
const fetchActivitiesTrendsData = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/activity_trends');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to fetch progress trends data
const fetchProgressTrendsData = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/progress_trends');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to fetch priority trends data
const fetchPriorityTrendsData = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/priority_trends');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Exporting all API functions for use in other parts of the application
export { getTasks, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskAttribute, fetchActivitiesTrendsData, fetchProgressTrendsData, fetchPriorityTrendsData };

