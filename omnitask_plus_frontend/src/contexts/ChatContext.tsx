import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

interface Message {
  id: string;
  text: string;
  sender: string;
  message: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  addMessage: (message: Message) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const addMessage = (message: Message) => setMessages((prevMessages) => [...prevMessages, message]);

  return (
    <ChatContext.Provider value={{ messages, setMessages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
