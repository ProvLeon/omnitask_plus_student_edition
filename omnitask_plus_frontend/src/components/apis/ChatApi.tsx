// Importing necessary modules and functions
import { StreamChat } from 'stream-chat';
import { getUserData } from './UserApi';

// Function to connect a user to the chat service
const connectUser = async () => {
  // Getting the StreamChat client instance with the API key from environment variables
  const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
  // Retrieving the chat token and user ID from session storage
  const chatToken = sessionStorage.getItem('chatToken');
  const userId = sessionStorage.getItem('userId');

  // If either userId or chatToken is missing, log an error and return null
  if (!userId || !chatToken) {
    console.error("UserId or chatToken is missing.");
    return null;
  }

  // If the client exists, proceed to connect the user
  if (client) {
    // Fetching user data using the userId
    const userData = await getUserData(userId);

    // Connecting the user with the fetched user data and chat token
    if (userId) {
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
    }
  }
  // Returning the client instance
  return client;
};

// Function to initiate a private chat with one or more friends
const initiatePrivateChat = async (friendId: string[]) => {
  // Retrieving the current user's ID from session storage
  const userId = sessionStorage.getItem('userId');

  try {
    // Connecting the current user
    const client = await connectUser();
    // Throwing an error if userId is not a string
    if (typeof userId !== 'string') {
      throw new Error('User ID is not available');
    }
    // Preventing a user from creating a chat with themselves
    if (friendId.includes(userId)) {
      console.error("Cannot create a channel with oneself.");
      return;
    }
    // Creating a new chat channel with the specified members
    const channel = client?.channel('messaging', undefined, {
      members: [userId, ...friendId],
    });
    // Creating the channel on the server
    await channel?.create();
    // Returning the channel ID
    return { channelId: channel?.id };
  } catch (error) {
    console.error('Error initiating private chat:', error);
    throw error;
  }
};

// Function to initiate a group chat with multiple friends
const initiateGroupChat = async (friendId: string[]) => {
  // The implementation is identical to initiatePrivateChat
  // This could be refactored to reduce duplication
  const userId = sessionStorage.getItem('userId');

  try {
    const client = await connectUser();
    if (typeof userId !== 'string') {
      throw new Error('User ID is not available');
    }
    if (friendId.includes(userId)) {
      console.error("Cannot create a channel with oneself.");
      return;
    }
    const channel = client?.channel('messaging', undefined, {
      members: [userId, ...friendId],
    });
    await channel?.create();
    return { channelId: channel?.id };
  } catch (error) {
    console.error('Error initiating private chat:', error);
    throw error;
  }
};

// Function to send a message in a specific channel
const sendMessage = async (channelId: string, message: string) => {
  // Retrieving the current user's ID from session storage
  const userId = sessionStorage.getItem('userId');

  try {
    // Connecting the current user
    const client = await connectUser();
    // Getting the channel instance by its ID
    const channel = client?.channel('messaging', channelId);
    // Sending the message in the channel
    const response = await channel?.sendMessage({
      text: message,
      user: { id: userId as string },
    });
    // Returning the sent message
    return response?.message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to list messages from a specific channel
const listMessages = async (channelId: string) => {
  try {
    // Connecting the current user
    const client = await connectUser();
    // Getting the channel instance by its ID
    const channel = client?.channel('messaging', channelId);
    // Querying the last 100 messages from the channel
    const response = await channel?.query({ messages: { limit: 100 } });
    // Returning the messages
    return response?.messages;
  } catch (error) {
    console.error('Error listing messages:', error);
    throw error;
  }
};

// Function to create a new channel
const createChannel = async (channelType: string, channelId: string) => {
  // Retrieving the current user's ID from session storage
  const userId = sessionStorage.getItem('userId');

  try {
    // Connecting the current user
    const client = await connectUser();
    // Creating a new channel with the specified type and ID
    const channel = client?.channel(channelType, channelId, {
      created_by_id: userId,
    });
    // Creating the channel on the server
    await channel?.create();
    // Returning the channel ID
    return { channelId: channel?.id };
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
};

// Function to delete a channel by its ID
const deleteChannel = async (channelId: string) => {
  try {
    // Connecting the current user
    const client = await connectUser();
    // Getting the channel instance by its ID
    const channel = client?.channel('messaging', channelId);
    // Deleting the channel on the server
    await channel?.delete();
    // Returning a success message
    return { message: 'Channel deleted successfully' };
  } catch (error) {
    console.error('Error deleting channel:', error);
    throw error;
  }
};

// Function to add a new member to a channel
const addMember = async (channelId: string, newMemberId: string) => {
  try {
    // Connecting the current user
    const client = await connectUser();
    // Getting the channel instance by its ID
    const channel = client?.channel('messaging', channelId);
    // Adding the new member to the channel
    await channel?.addMembers([newMemberId]);
    // Returning a success message
    return { message: 'Member added successfully' };
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

// Function to upload a file and return its URL
const uploadFile = async (file: File): Promise<string> => {
  // Creating a FormData object and appending the file to it
  const formData = new FormData();
  formData.append('file', file);

  // Sending the FormData to the server
  const response = await fetch('YOUR_ENDPOINT_HERE', {
    method: 'POST',
    body: formData,
  });

  // If the response is not OK, throw an error
  if (!response.ok) {
    throw new Error('File upload failed');
  }

  // Parsing the response JSON to get the file URL
  const data = await response.json();
  return data.fileUrl; // Assuming the server responds with the URL of the uploaded file
};

// Function to list all connected users based on a search input
const listAllConnectedUsers = async (inputText: string) => {
  try {
    // Connecting the current user
    const client = await connectUser();
    // Querying users based on the input text
    const response = await client?.queryUsers({
      role: { $in: ['user', 'moderator'] },
      $or: [
        { name: { $autocomplete: inputText } },
        { username: { $autocomplete: inputText } }
      ],
    },
    { id: 1 },
    { limit: 8 },
    );
    // Returning the list of users
    return response?.users;
  } catch (error) {
    console.error('Error listing all users with roles:', error);
    throw error;
  }
};

// Exporting all the functions to be used elsewhere in the application
export {  connectUser, initiatePrivateChat, initiateGroupChat, sendMessage, listMessages, createChannel, deleteChannel, addMember, uploadFile, listAllConnectedUsers };
