import axios from 'axios';
import { StreamChat } from 'stream-chat';
import { getUserData } from './UserApi';

const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

const connectUser = async () => {
  const chatToken = sessionStorage.getItem('chatToken');
  const userId = sessionStorage.getItem('userId');

  if (client.userID && client.userID === userId) {
    console.log("User already connected.");
    // return client; // Return the existing client instance without reconnecting
    await client.disconnectUser();
  }
  if (userId && chatToken) {
    const userData = await getUserData(userId);
    await client.connectUser(
      {
        id: userId,
        username: userData.username,
        name: userData.name,
        image: userData.image,
      },
      chatToken
    );
    console.log("User connected successfully.");
    return client;
  } else {
    console.error("UserId or chatToken is missing.");
    return null;
  }
};

const checkUserOnlineStatus = async (userId: string) => {
  try {
    const { users } = await client.queryUsers({ id: userId });
    if (users.length > 0) {
      return users[0].online;
    }
    return false;
  } catch (error) {
    console.error('Error checking user online status:', error);
    throw error;
  }
};

const initiatePrivateChat = async (friendId: string[]) => {
  const userId = sessionStorage.getItem('userId');

  try {
    if (typeof userId !== 'string') {
      throw new Error('User ID is not available');
    }
    if (friendId.includes(userId)) {
      console.error("Cannot create a channel with oneself.");
      return;
    }
    const channel = client.channel('messaging', undefined, {
      members: [userId, ...friendId],
    });
    await channel.create();
    return { channelId: channel.id };
  } catch (error) {
    console.error('Error initiating private chat:', error);
    throw error;
  }
};

const initiateGroupChat = async (friendId: string[]) => {
  const userId = sessionStorage.getItem('userId');

  try {
    if (typeof userId !== 'string') {
      throw new Error('User ID is not available');
    }
    if (friendId.includes(userId)) {
      console.error("Cannot create a channel with oneself.");
      return;
    }
    const channel = client.channel('messaging', undefined, {
      members: [userId, ...friendId],
    });
    await channel.create();
    return { channelId: channel.id };
  } catch (error) {
    console.error('Error initiating private chat:', error);
    throw error;
  }
};

const sendMessage = async (channelId: string, message: string) => {
  const userId = sessionStorage.getItem('userId');

  try {
    const channel = client.channel('messaging', channelId);
    const response = await channel.sendMessage({
      text: message,
      user: { id: userId as string },
    });
    return response.message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const listMessages = async (channelId: string) => {
  try {
    const channel = client.channel('messaging', channelId);
    const response = await channel.query({ messages: { limit: 100 } });
    return response.messages;
  } catch (error) {
    console.error('Error listing messages:', error);
    throw error;
  }
};

const createChannel = async (channelType: string, channelId: string) => {
  const userId = sessionStorage.getItem('userId');

  try {
    const channel = client.channel(channelType, channelId, {
      created_by_id: userId,
    });
    await channel.create();
    return { channelId: channel.id };
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
};

const deleteChannel = async (channelId: string) => {
  try {
    const channel = client.channel('messaging', channelId);
    await channel.delete();
    return { message: 'Channel deleted successfully' };
  } catch (error) {
    console.error('Error deleting channel:', error);
    throw error;
  }
};

const addMember = async (channelId: string, newMemberId: string) => {
  try {
    const channel = client.channel('messaging', channelId);
    await channel.addMembers([newMemberId]);
    return { message: 'Member added successfully' };
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('YOUR_ENDPOINT_HERE', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  const data = await response.json();
  return data.fileUrl; // Assuming the server responds with the URL of the uploaded file
};

const listAllConnectedUsers = async () => {
  try {
    const response = await client.queryUsers({});
    return response.users;
  } catch (error) {
    console.error('Error listing all users:', error);
    throw error;
  }
};

export { client, connectUser, initiatePrivateChat, initiateGroupChat, sendMessage, listMessages, createChannel, deleteChannel, addMember, uploadFile, checkUserOnlineStatus, listAllConnectedUsers };

