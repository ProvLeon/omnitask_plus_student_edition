import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Divider, Typography, Box, Paper, InputBase, IconButton, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { socket, connectChatServer, sendMessage, receiveMessage, disconnectChatServer } from '../components/apis/ChatApi';
import { getUserData, getAllUsers } from '../components/apis/UserApi'; // Modified import to use getUserData from UserApi.tsx

interface User {
  username: string;
  image: string;
  // Add other properties as needed
}

const Chat = () => {
  const [username, setUsername] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const [friendsList, setFriendsList] = useState<User[]>([]);
  const [currentChat, setCurrentChat] = useState('');
  const [messages, setMessages] = useState<Array<{sender: string, message: string}>>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    connectChatServer();

    socket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      disconnectChatServer();
    }

  }, []);

  useEffect(() => {
    receiveMessage((newMessage: any) => {
      const message = newMessage as { sender: string; receiver: string; message: string };
      if (message.sender === currentChat || message.receiver === currentChat) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
  }, [currentChat]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log(response);
        setUserList(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchAllUsers();
  }, []);

  const addFriend = (user: User) => {
    setFriendsList((prevFriends) => [...prevFriends, user]);
  };

  const initiateChat = (username: string) => {
    setCurrentChat(username);
    setMessages([]);
  };

  const searchUsers = () => {
    const filteredUsers = userList.filter(user => user.username.includes(username));
    setFriendsList(filteredUsers);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: '30%', borderRight: 1, borderColor: 'divider', p: 2 }}>
        <Typography variant="h6" gutterBottom>Friends</Typography>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 2 }}
          elevation={3}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search User by Username"
            inputProps={{ 'aria-label': 'search user by username' }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={searchUsers}>
            <SearchIcon />
          </IconButton>
        </Paper>
        <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto' }}>
          {friendsList.map((friend) => (
            <React.Fragment key={friend.username}>
              <ListItem button onClick={() => initiateChat(friend.username)}>
                <ListItemText primary={friend.username} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
      <Box sx={{ width: '70%', p: 2 }}>
        {currentChat ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>Chat with {currentChat}</Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: '70vh', overflow: 'auto' }}>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${message.sender}: ${message.message}`} />
                </ListItem>
              ))}
            </List>
            <TextField
              label="Type a message"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const messageToSend = (e.target as HTMLInputElement).value;
                  const timestamp = new Date().toISOString(); // Example of a timestamp
                  sendMessage(currentChat, messageToSend, timestamp);
                  setMessages(prev => [...prev, { sender: 'You', message: messageToSend }]);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </Box>
        ) : (
          <Grid container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
            <Grid item>
              <Typography variant="h5" gutterBottom align="center">
                Select a friend to start chatting
              </Typography>
              <Box display="flex" justifyContent="center">
                <ChatBubbleOutlineIcon style={{ fontSize: 60 }} />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Chat;
