import axios from 'axios';
import { fileToBase64 } from '../../utils/utils';
import { User } from '../Tasks/TaskForm';

const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/tasks';

const getAuthToken = (): string | null => {
  const token = sessionStorage.getItem('accessToken');
  return token;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

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

interface TaskData {
  [key: string]: any;
  media?: File | string | null;
  persons_responsible?:  User[];
}


const createTask = async (taskData: TaskData): Promise<any> => {
  if (taskData.media && (taskData.media instanceof File)) {
    (taskData as any).media = await fileToBase64(taskData.media as File);
  }

  try {
    const response = await axiosInstance.post('/', taskData, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateTask = async (taskId: string, taskData: TaskData): Promise<any> => {
  if (taskData.media && (taskData.media instanceof File)) {
    (taskData as any).media = await fileToBase64(taskData.media as File);
  }

  try {
    const response = await axiosInstance.put(`/${taskId}`, taskData, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (taskId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API call to update task status
const updateTaskStatus = async (taskId: string, status: string): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/${taskId}/status`, { status: status }, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// API call to update a specific task attribute
const updateTaskAttribute = async (taskId: string, attribute: string, value: any): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/${taskId}/${attribute}`, { value: value }, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API call to fetch trend data
const fetchActivitiesTrendsData = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/activity_trends', {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API call to fetch progress trends data
const fetchProgressTrendsData = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/progress_trends', {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API call to fetch priority trends data
const fetchPriorityTrendsData = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/priority_trends', {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    console.log(response)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getTasks, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskAttribute, fetchActivitiesTrendsData, fetchProgressTrendsData, fetchPriorityTrendsData };

