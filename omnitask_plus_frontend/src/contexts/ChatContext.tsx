import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { StreamChat } from 'stream-chat';

interface Message {
  id: string;
  text: string;
  sender: string;
  message: string;
  timestamp: Date;
}

// interface ChatContextType {
//   messages: Message[];
//   setMessages: Dispatch<SetStateAction<Message[]>>;
//   addMessage: (message: Message) => void;
// }
interface ChatContextType {
  chatClient: StreamChat | null;
  setChatClient: (client: StreamChat) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  // const [messages, setMessages] = useState<Message[]>([]);
  // const addMessage = (message: Message) => setMessages((prevMessages) => [...prevMessages, message]);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  return (
    <ChatContext.Provider value={{ chatClient, setChatClient }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const useChatContext = () => useContext(ChatContext);
