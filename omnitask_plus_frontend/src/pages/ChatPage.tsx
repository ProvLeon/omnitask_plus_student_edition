import { useState, useEffect } from 'react';
import { Channel as ChannelComponent } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
// import { Button } from '@mui/material';
import { EmojiPicker } from 'stream-chat-react/emojis';
import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
// import { Box } from '@mui/system';
import 'stream-chat-react/dist/css/v2/index.css';
import './Chat/styles/index.css'

import { connectUser } from '../components/apis/ChatApi';
// import { getUserData } from '../components/apis/UserApi';
// import { getChannelListOptions } from './channelListOptions';
import { useMobileView } from './Chat/hooks'
import { GiphyContextProvider, useThemeContext } from './Chat/context';


// const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
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
// import { StreamChatGenerics } from './Chat/types';


export let useChatClient: StreamChat;

const WrappedEmojiPicker = () => {

  return <EmojiPicker pickerProps={{ theme: 'light' }} />;
};
const ChatComponent = () => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { themeClassName } = useThemeContext();
  const toggleMobile = useMobileView();
  const [channelListOptions, setChannelListOptions] = useState({filters: {}, sort: {}, options: {}})
  // const [searchResults, setSearchResults] = useState<UserData[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {

    const initChat = async () => {
      const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
      // Assuming you have a way to get the current user's ID and token
      const userId = sessionStorage.getItem('userId'); // Replace with actual user ID
      const userToken = sessionStorage.getItem('userToken'); // Replace with actual user token
      let uniqueUserId;
      // if (userId) {
      //   userData = await getUserData(userId);
      // }
      if (userId && userToken) {

        const userData = await getUserData(userId);
        const existingUsers = await client.queryUsers({ username: userData.username });

        // uniqueUserId = userId;
        if (existingUsers.users.length > 0) {
          // If username exists, use the existing user's ID to ensure uniqueness
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
          // setChannelListOptions(getChannelListOptions(true, client.user?.id || ''))

            setChatClient(client);
          };
        }
        if (chatClient){

          useChatClient = chatClient
        }

    initChat();

    return () => {
      chatClient?.disconnectUser().catch(console.error);
    }
  }})

  // useEffect(() => {
  //   const fetchSearchResults = async () => {
  //     // setLoading(true);
  //     getUserSearch(searchTerm, (users) => {
  //       const formattedSearchResults: UserData[] = users.map((user: ExtendedUser) => ({
  //         ...user,
  //         contact: user.contact || '' // Now TypeScript knows `contact` might exist
  //       }));
  //       // setSearchResults(formattedSearchResults);
  //     }, setLoading);
  //   };

  //   if (searchTerm) {
  //     fetchSearchResults();
  //   } else {
  //     setSearchResults([]);
  //   }
  // }, [searchTerm]);

  useEffect(() => {
    const initializeChat = async () => {
      const chatClient = await connectUser();
      setChatClient(chatClient);
      if (chatClient && chatClient.user) {
        // const userData = await getUserData(chatClient.user.id);
        // setUserData(userData);
        // const users = await listAllConnectedUsers();
        // console.log('lomotey', users)
        // const formattedUsers: UserData[] = users.map(user => ({
        //   username: user.username as string,
        //   email: user.email as string,
        //   id: user.id,
        //   image: user.image as string,
        //   contact: user.contact as string
        // }));
        // console.log(users)
        // setConnectedUsers(formattedUsers);

        // Use getChannelListOptions here
        const channelList = getChannelListOptions(true, chatClient.user.id);
        setChannelListOptions(channelList)
        // const channels = await chatClient.queryChannels(channelList);
        // Assuming you have a state or method to handle the fetched channels
        // setChannels(channels);
      }
    };
    initializeChat();
  }, []);

  // const handleUserSelection = (userId: string, checked: boolean) => {
  //   if (checked) {
  //     setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, userId]);
  //   } else {
  //     setSelectedUsers(prevSelectedUsers => prevSelectedUsers.filter(id => id !== userId));
  //   }
  // };

  if (!chatClient) {
    return <Loading/>
  }

  return (
    <div className='h-[100%]'>

          <div>
              {isCreating && (<div className=' bg-transparent z-10'>

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
