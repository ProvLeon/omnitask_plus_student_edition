import { useState, useEffect } from 'react';
import { Channel as ChannelComponent } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { EmojiPicker } from 'stream-chat-react/emojis';
import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
import 'stream-chat-react/dist/css/v2/index.css';
import './Chat/styles/index.css'

import { connectUser } from '../components/apis/ChatApi';
import { useMobileView } from './Chat/hooks'
import { GiphyContextProvider, useThemeContext } from './Chat/context';

// Initialize emoji picker with data
init({ data });

import {
  ChannelInner,
  CreateChannel,
  MessagingSidebar,
  MessagingThreadHeader,
  SendButton,
} from './Chat/Component';
import { getUserData } from '../components/apis/UserApi';
import { getChannelListOptions } from './channelListOptions';
import Loading from '../components/SmallComponents/Loading';

// Declaration of a global variable to hold the chat client instance
export let useChatClient: StreamChat;

// WrappedEmojiPicker component for customizing the emoji picker
const WrappedEmojiPicker = () => {
  return <EmojiPicker pickerProps={{ theme: 'light' }} />;
};

// Main ChatComponent that handles the chat functionality
const ChatComponent = () => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { themeClassName } = useThemeContext();
  const toggleMobile = useMobileView();
  const [channelListOptions, setChannelListOptions] = useState({filters: {}, sort: {}, options: {}})

  // Effect hook to initialize chat client and connect user
  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
      const userId = sessionStorage.getItem('userId');
      const userToken = sessionStorage.getItem('userToken');
      if (userId && userToken) {
        const userData = await getUserData(userId);
        const existingUsers = await client.queryUsers({ username: userData.username });
        let uniqueUserId;
        if (existingUsers.users.length > 0) {
          uniqueUserId = existingUsers.users[0].id;
          console.log(`Username already exists. Using existing userId: ${uniqueUserId}`);
        }
        if (userId) {
          await client.connectUser(
            {
              id: userId,
              username: userData.username,
              name: userData.name,
              image: userData.image,
            },
            userToken
          );
          setChatClient(client);
        }
      }
      if (chatClient){
        useChatClient = chatClient
      }
    };
    initChat();
    return () => {
      chatClient?.disconnectUser().catch(console.error);
    }
  }, []);

  // Effect hook to initialize chat client using connectUser API
  useEffect(() => {
    const initializeChat = async () => {
      const chatClient = await connectUser();
      setChatClient(chatClient);
      if (chatClient && chatClient.user) {
        const channelList = getChannelListOptions(true, chatClient.user.id);
        setChannelListOptions(channelList)
      }
    };
    initializeChat();
  }, []);

  // Render loading component if chatClient is not initialized
  if (!chatClient) {
    return <Loading/>
  }

  // Main render method for the chat component
  return (
    <div className='h-[100%]'>
      <div>
        {isCreating && (
          <div className=' bg-transparent z-10'>
            <CreateChannel onClose={() => setIsCreating(false)} />
          </div>
        )}
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
            TypingIndicator={() => true}
            EmojiPicker={WrappedEmojiPicker}
            emojiSearchIndex={SearchIndex}
          >
            <GiphyContextProvider>
              <ChannelInner theme={themeClassName} toggleMobile={toggleMobile} />
            </GiphyContextProvider>
          </ChannelComponent>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

