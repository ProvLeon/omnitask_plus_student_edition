// Importing necessary modules and components
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // Main App component
import './index.css' // Global styles
import { ChatProvider } from './contexts/ChatContext.tsx' // Context provider for chat functionalities
import { Chat } from 'stream-chat-react' // Chat component from stream-chat-react library
import { ThemeContextProvider } from './pages/Chat/context' // Context provider for theme
import { StreamChat } from 'stream-chat' // StreamChat class from stream-chat library

// Creating a chat client instance using the API key from environment variables
const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

// Rendering the application into the DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider targetOrigin='https://localhost:5000'>
        <Chat client={client} theme="messaging light">
            <ChatProvider>
              <App /> {/* Main application component */}
            </ChatProvider>
        </Chat>
      </ThemeContextProvider>
  </React.StrictMode>
);
