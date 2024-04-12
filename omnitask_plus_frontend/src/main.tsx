import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChatProvider } from './contexts/ChatContext.tsx'
import { Chat } from 'stream-chat-react'
import { ThemeContextProvider } from './pages/Chat/context'
// import { useChatClient } from './pages/ChatPage.tsx'
import { StreamChat } from 'stream-chat'

const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider targetOrigin='https://localhost:5000'>
        <Chat client={client} theme="messaging light">

    <ChatProvider>
      <App />
    </ChatProvider>

        </Chat>
      </ThemeContextProvider>
  </React.StrictMode>
);
