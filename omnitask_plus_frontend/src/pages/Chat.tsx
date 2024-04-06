import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, Badge, Button, Input } from 'antd';
import { UserOutlined, SendOutlined, BellOutlined, SearchOutlined } from '@ant-design/icons';
import { connectChatServer, disconnectChatServer, sendMessage, receiveMessage, getActiveUsers } from '../components/apis/ChatApi';
import { getUserData, getAllUsers } from '../components/apis/UserApi';
import { TextField } from '@mui/material';
// import 'antd/dist/antd.css'; // Import Ant Design styles

interface User {
  username: string;
  image: string;
  hasNewMessage?: boolean;
}

interface Message {
  sender: string;
  message: string;
}

const Chat = () => {
  const [username, setUsername] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const [friendsList, setFriendsList] = useState<User[]>([]);
  const [currentChat, setCurrentChat] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      connectChatServer(userId).then(() => {
        setIsConnected(true);
        receiveMessage((data: { senderId: string, text: string }) => {
          setMessages((prevMessages) => [...prevMessages, { sender: data.senderId, message: data.text }]);
          console.log(`Received message from ${data.senderId}: ${data.text}`); // Log received messages
          // Mark the sender as having a new message if not currently in chat with them
          if (data.senderId !== currentChat) {
            setFriendsList((prevList) =>
              prevList.map((user) =>
                user.username === data.senderId ? { ...user, hasNewMessage: true } : user
              )
            );
          }
        });
      });
      return () => {
        disconnectChatServer();
        setIsConnected(false);
      };
    }
  }, [currentChat]);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() !== '') {
      const senderId = sessionStorage.getItem('userId') || 'unknown';
      sendMessage(senderId, currentChat, newMessage.replace(/\n/g, '<br/>'));
      setMessages((prevMessages) => [...prevMessages, { sender: 'me', message: newMessage }]);
      setNewMessage('');
    }
  }, [newMessage, currentChat]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await getAllUsers();
        setUserList(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchAllUsers();
  }, []);

  const initiateChat = (username: string) => {
    setCurrentChat(username);
    setMessages([]);
    setFriendsList((prevList) =>
      prevList.map((user) =>
        user.username === username ? { ...user, hasNewMessage: false } : user
      )
    );
    // Fetch previous messages for the initiated chat
    receiveMessage((data: { senderId: string, text: string }) => {
      setMessages((prevMessages) => [...prevMessages, { sender: data.senderId, message: data.text }]);
    });
  };

  const searchUsers = () => {
    const filteredUsers = userList.filter(user => user.username.includes(username));
    setFriendsList(filteredUsers);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h6>Friends</h6>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search User by Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Button icon={<SearchOutlined />} onClick={searchUsers} />
        </div>
        <div style={{ overflowY: 'auto' }}>
          {friendsList.map((friend) => (
            <div key={friend.username} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', cursor: 'pointer' }} onClick={() => initiateChat(friend.username)}>
              <Avatar src={friend.image} icon={<UserOutlined />} />
              <span style={{ marginLeft: '10px' }}>{friend.username}</span>
              {friend.hasNewMessage && (
                <Badge dot>
                  <BellOutlined />
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '70%', padding: '20px' }}>
        {currentChat ? (
          <div>
            <h4>Chat with {currentChat}</h4>
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {messages.map((message, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                  <div style={{ maxWidth: '60%', padding: '10px', borderRadius: '20px', backgroundColor: message.sender === 'me' ? '#daf8cb' : '#f0f0f0' }}>
                    <span dangerouslySetInnerHTML={{__html: `${message.sender === 'me' ? '' : message.sender + ': '}${message.message}`}}></span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <TextField
                multiline
                maxRows={4}
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.shiftKey) {
                    setNewMessage(newMessage + "\n");
                    e.preventDefault(); // Prevent default to avoid sending message
                  } else if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent default to avoid newline on enter
                    handleSendMessage();
                  }
                }}
                style={{ marginRight: '10px', width: '100%' }}
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <h5>Select a friend to start chatting</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

