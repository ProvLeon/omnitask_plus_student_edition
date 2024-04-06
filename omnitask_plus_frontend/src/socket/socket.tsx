import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useChatContext } from '../contexts/ChatContext'; // Assuming there's a ChatContext for global state management

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
export const useChatSocket = () => {
  const chatContext = useChatContext();
  if (!chatContext) {
    throw new Error('ChatContext is undefined');
  }
  const { setMessages, addMessage } = chatContext; // Now guaranteed not to be undefined

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "omnitask-plus-socket"
      },
      auth: {
        token: "Bearer " + sessionStorage.getItem('accessToken'), // Send the token for authentication
      },
    });

    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('receiveMessage', (message) => {
      addMessage(message); // Add the received message to the chat context
    });

    socket.on('initialMessages', (messages) => {
      setMessages(messages); // Set initial messages on connection
    });

    return () => {
      socket.disconnect();
    };
  }, [setMessages, addMessage]);

  const sendMessage = (senderId: string, receiverId: string, message: string) => {
    const socket = io(SOCKET_URL);
    socket.emit('sendMessage', { senderId, receiverId, message });
  };

  return { sendMessage };
};
