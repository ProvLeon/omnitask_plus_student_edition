import axios from 'axios';

// Utilize environment variable for BASE_URL
// Fix: Directly access environment variables using import.meta.env
const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL + '/tasks';

// Function to get the authorization token
const getAuthToken = (): string | null => {
  const token = localStorage.getItem('accessToken');
  return token;
};

// Enhanced Axios instance with base configurations
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Updated to handle JSON data
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

// Helper function to convert Base64 to File
// const base64ToFile = (base64: string, filename: string): File => {
//   const arr = base64.split(',');
//   const mimeMatch = arr[0].match(/:(.*?);/);
//   if (!mimeMatch) throw new Error('MIME type could not be determined from base64 string');
//   const mime = mimeMatch[1];
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);

//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }

//   return new File([u8arr], filename, { type: mime });
// };

// API call to fetch tasks
const getTasks = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/');
    const tasks = response.data.map((task: any) => {
      // if (task.media) {
      //   const filename = `${task.id}.${task.media.split('.').pop()}`; // Extract extension and prepend task ID
      //   task.media = base64ToFile(task.media, filename);
      // }
      return task;
    });
    return tasks;
  } catch (error) {
    throw error;
  }
};

interface TaskData {
  [key: string]: any; // Allows any property with string key
  media?: File | null; // Media must be sent as a File
}

// Helper function to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

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

export { getTasks, createTask, updateTask, deleteTask, fileToBase64 };
