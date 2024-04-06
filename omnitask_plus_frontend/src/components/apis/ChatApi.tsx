import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Establish a socket connection with appropriate configurations
const socket = io(SOCKET_URL, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "omnitask-plus-socket"
  },
  auth: {
    token: `Bearer ${sessionStorage.getItem('accessToken')}`, // Authenticate using the token
  },
  transports: ['websocket'], // Opt for WebSocket to ensure real-time communication
});

// Connect to the chat server and manage user connections
const connectChatServer = async (userId: string) => {
  socket.connect(); // Initiate the connection

  socket.on('connect', () => {
    console.log('Successfully connected to the chat server');
    // Upon successful connection, register the user
    socket.emit('addUser', userId);
  });

  socket.on('connect_error', (error) => {
    console.error('Failed to connect to the chat server:', error);
  });
};

// Disconnect from the chat server
const disconnectChatServer = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Send a message to a specific user
const sendMessage = (senderId: string, receiverId: string, text: string) => {
  socket.emit('sendMessage', { senderId, receiverId, text });
};

// Listen for incoming messages and handle them using a callback
const receiveMessage = (callback: (data: {senderId: string, text: string}) => void) => {
  socket.on('newMessage', (data) => {
    callback(data);
    console.log('Received message:', data);
  });
};

// Fetch the list of active users
const getActiveUsers = (callback: (users: Record<string, string>) => void) => {
  socket.emit('getUsers');
  socket.on('activeUsers', (users) => {
    callback(users);
  });
};

export { socket, connectChatServer, disconnectChatServer, sendMessage, receiveMessage, getActiveUsers };

