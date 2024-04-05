import {io} from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Initialize socket connection
const socket = io(SOCKET_URL, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "omnitask-plus-socket"
  },
  auth: {
    token: "Bearer " + sessionStorage.getItem('accessToken'), // Send the token for authentication
  },
});

// Function to connect to the chat server
const connectChatServer = () => {
  socket.on('connect', () => {
    console.log('Connected to chat server');
  });
};

// Function to disconnect from the chat server
const disconnectChatServer = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Function to send a message
const sendMessage = (senderId: string, receiverId: string, message: string) => {
  socket.emit('sendMessage', { senderId, receiverId, message });
};

// Function to receive messages
const receiveMessage = (callback: (message: string) => void) => {
  socket.on('receiveMessage', (message) => {
    callback(message);
  });
};

export { socket, connectChatServer, disconnectChatServer, sendMessage, receiveMessage };

