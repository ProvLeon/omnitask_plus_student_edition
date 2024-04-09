import React, { useState, useEffect } from 'react';
import { Chat, Channel as ChannelComponent, Window, ChannelHeader, MessageList, MessageInput, ChannelList, Avatar } from 'stream-chat-react';
import { StreamChat, Channel } from 'stream-chat';
import { Button } from '@mui/material';
import { EmojiPicker } from 'stream-chat-react/emojis';
import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
import { Box } from '@mui/system';
import 'stream-chat-react/dist/css/v2/index.css';
import './Chat/styles/index.css'

import { client, connectUser, initiatePrivateChat, initiateGroupChat, listAllConnectedUsers } from '../components/apis/ChatApi';
import { getUserData } from '../components/apis/UserApi';
import { getChannelListOptions } from './channelListOptions';
import { useMobileView } from './Chat/hooks'
import { GiphyContextProvider, ThemeContextProvider, useThemeContext } from './Chat/context';


init({ data });

import {
  ChannelInner,
  CreateChannel,
  MessagingSidebar,
  MessagingThreadHeader,
  SendButton,
  UserSearch,
} from './Chat/Component';
import { getUserSearch } from '../utils/utils'; // Import getUserSearch from utils.tsx

interface UserData {
  username: string;
  email: string;
  id: string;
  image: string;
  contact: string;
}

const WrappedEmojiPicker = () => {
  const { theme } = useThemeContext();

  return <EmojiPicker pickerProps={{ theme: 'light' }} />;
};
const ChatComponent = () => {
  const [currentChannel, setCurrentChannel] = useState<Channel | undefined>(undefined);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<UserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { themeClassName } = useThemeContext();
  const { theme } = useThemeContext();
  const toggleMobile = useMobileView();
  const [channelListOptions, setChannelListOptions] = useState({filters: {}, sort: {}, options: {}})
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const { searchResults: users } = await getUserSearch(searchTerm);
        const formattedSearchResults: UserData[] = users.map(user => ({
          ...user,
          contact: (user as any).contact || '' // Adapt or provide a default value for 'contact'
        }));
        setSearchResults(formattedSearchResults);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    const initializeChat = async () => {
      const chatClient = await connectUser();
      setChatClient(chatClient);
      if (chatClient && chatClient.user) {
        const userData = await getUserData(chatClient.user.id);
        setUserData(userData);
        const users = await listAllConnectedUsers();
        console.log('lomotey', users)
        const formattedUsers: UserData[] = users.map(user => ({
          username: user.username as string,
          email: user.email as string,
          id: user.id,
          image: user.image as string,
          contact: user.contact as string
        }));
        console.log(users)
        setConnectedUsers(formattedUsers);

        // Use getChannelListOptions here
        const channelList = getChannelListOptions(true, chatClient.user.id);
        setChannelListOptions(channelList)
        const channels = await chatClient.queryChannels(channelList);
        // Assuming you have a state or method to handle the fetched channels
        // setChannels(channels);
      }
    };
    initializeChat();
  }, []);

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, userId]);
    } else {
      setSelectedUsers(prevSelectedUsers => prevSelectedUsers.filter(id => id !== userId));
    }
  };

  const initiateChat = async () => {
    if (!chatClient || selectedUsers.length === 0) return;
    let response;
    if (selectedUsers.length === 1) {
      response = await initiatePrivateChat(selectedUsers);
    } else {
      response = await initiateGroupChat(selectedUsers);
    }
    if (response && response.channelId) {
      const channel = chatClient.channel('messaging', response.channelId);
      setCurrentChannel(channel);
    }
  };

  if (!chatClient) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>Loading...</Box>;
  }

  return (
    <ThemeContextProvider targetOrigin='https://localhost:3000'>
        <Chat client={chatClient} theme="messaging light">
          <div>
            <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchResults={searchResults} loading={loading} handleUserSelection={handleUserSelection} />
          </div>
            <div className='flex flex-row h-full'>
            <div className='flex-initial w-1/3'>

            <MessagingSidebar
        channelListOptions={channelListOptions}
        onClick={toggleMobile}
        onCreateChannel={() => setIsCreating(!isCreating)}
        onPreviewSelect={() => setIsCreating(false)}
        />
        </div>
        <div className='flex-auto overflow-y-auto w-2/3 relative'>

        <ChannelComponent
        maxNumberOfFiles={10}
        multipleUploads={true}
        SendButton={SendButton}
        ThreadHeader={MessagingThreadHeader}
        TypingIndicator={() => null}
        EmojiPicker={WrappedEmojiPicker}
        emojiSearchIndex={SearchIndex}
        >
        {isCreating && (<div className='bg-transparent z-10'>

          <CreateChannel toggleMobile={toggleMobile} onClose={() => setIsCreating(false)} />
        </div>
          )}
        <GiphyContextProvider>
          <ChannelInner theme={themeClassName} toggleMobile={toggleMobile} />
        </GiphyContextProvider>
      </ChannelComponent>
          </div>
          </div>
        </Chat>
      </ThemeContextProvider>

  );
};

export default ChatComponent;
