import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, Fragment } from 'react';
import { IconButton, Menu, MenuItem, useMediaQuery, useTheme, Dialog, DialogTitle, List, ListItem, ListItemText, ListItemAvatar, Avatar as MuiAvatar } from '@mui/material';
import { Menu as MenuIcon, NotificationsOutlined, Close } from '@mui/icons-material';
import Profile from '../SmallComponents/Profile';
import { getUserData } from '../apis/UserApi';
import { subscribe } from '../../utils/pubSub';
import PomodoroTimer from '../SmallComponents/PomodoroTimer';
import logo from '../../assets/omniTaskplusbgwhite.png'
import { Avatar } from 'antd';
import { DefaultStreamChatGenerics, useChatContext } from 'stream-chat-react';
import { Event } from 'stream-chat';

interface ProfileData {
  username: string;
  image: string;
}

interface Message {
  id: string;
  text: string;
  sender: { id: string; name: string; avatar: string };
  receiver: { id: string };
}

interface ExtendedMessageEvent {
  message: {
    id: string;
    text: string;
    user: {
      id: string;
      name?: string;
      image?: string;
    };
    receiver: {
      id: string;
    };
  };
}

const NaviBar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const profileRef = useRef(null);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMessages, setShowMessages] = useState(false);

  const [profileData, setProfileData] = useState({
    username: '',
    image: '',
  });

  const { client } = useChatContext();
  const user = client.user;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = sessionStorage.getItem('userId');
      if (!userId) return;
      try {
        const data = await getUserData(userId);
        const { username, image } = data;
        setProfileData({ username, image });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe('profileUpdate', (updatedProfileData: ProfileData) => {
      setProfileData(updatedProfileData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 80) {
          header.classList.add('fixed', 'top-2', 'left-[15%]', 'w-[70%]', 'z-50', 'backdrop-filter', 'backdrop-blur-lg', 'shadow-lg', 'rounded-lg', 'border', 'border-gray-200', 'px-4');
          header.style.transition = 'all 0.5s ease-in';
          setScrolled(true);
        } else {
          header.classList.remove('fixed', 'top-2', 'left-[15%]', 'w-[70%]', 'z-50', 'backdrop-filter', 'backdrop-blur-lg', 'shadow-lg', 'rounded-lg', 'border', 'border-gray-200', 'px-4');
          setScrolled(false);
        }

      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const messageHandler = (event: Event<DefaultStreamChatGenerics>) => {
      const extendedEvent = event as unknown as ExtendedMessageEvent; // Type assertion
      if (user && extendedEvent.message && extendedEvent.message.user && extendedEvent.message.user.id !== user.id && extendedEvent.message.receiver.id === user.id) {
        const adaptedMessage: Message = {
          id: extendedEvent.message.id,
          text: extendedEvent.message.text || '',
          sender: {
            id: extendedEvent.message.user?.id || '',
            name: extendedEvent.message.user?.name || '',
            avatar: extendedEvent.message.user?.image || '',
          },
          receiver: {
            id: user.id,
          },
        };
        setMessages(prevMessages => [...prevMessages, adaptedMessage]);
        setNewMessageCount(prevCount => prevCount + 1);
      }
    };

    if (client) {
      client.on('message.new', messageHandler);
    }

    return () => {
      if (client) {
        client.off('message.new', messageHandler);
      }
    };
  }, [client, user?.id]);

  const handleProfileClick = () => {
    // if (!user) return; // Add this line to guard against undefined user
    setShowProfile(!showProfile);
    document.body.style.overflow = showProfile ? 'auto' : 'hidden';
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    document.body.style.overflow = 'auto';
  };

  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = () => {
    setShowMessages(true);
  };

  const handleNavigateToChat = () => {
    navigate(`/chat`);
    setShowMessages(false);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderMobileMenu = (
    <Menu anchorEl={mobileMenuAnchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} id="primary-search-account-menu-mobile" keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={isMobileMenuOpen} onClose={handleMobileMenuClose}>
      <MenuItem onClick={handleMobileMenuClose}>
        <Link to="/boards">Boards</Link>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <Link to="/tasks">Tasks</Link>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <Link to="/chat">Chat</Link>
      </MenuItem>
    </Menu>
  );

  const renderNotification = (
    <div className='flex items-center gap-2'>
      <div className='relative cursor-pointer mr-2' onClick={handleNotificationClick}>
        <span className='absolute right-0 top-0 rounded-full w-4 h-4 text-center bg-red-500 text-white text-xs'>{newMessageCount}</span>
        <NotificationsOutlined className='text-gray-800 dark:text-white w-10 h-10'/>
      </div>
    </div>
  );

  const renderMessagesDialog = (
    <Dialog onClose={() => setShowMessages(false)} open={showMessages} fullWidth>
      <DialogTitle>Messages</DialogTitle>
      <List>
        {messages.map((message) => (
          <ListItem component="div" onClick={() => handleNavigateToChat()} key={message.id}>
            <ListItemAvatar>
              <MuiAvatar src={message.sender.avatar} />
            </ListItemAvatar>
            <ListItemText primary={message.sender.name} secondary={message.text} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );

  return (
    <Fragment>
      <header className="bg-transparent backdrop-filter backdrop-blur-sm border-b border-gray-400 dark:border-gray-700">
        <nav className="container mx-auto flex justify-between items-center py-4">
          <div className='flex items-center px-2'>
          {!scrolled ? <Link to="/main" className="text-xl font-bold text-gray-800 dark:text-white"><img src={logo} alt="OmniTask+" className="sm:min-w-25 md:w-30 w-30 h-9"/></Link> : null}
          {isMobile ? <IconButton edge="end" color="inherit" aria-label="open drawer" onClick={handleMobileMenuOpen}>
            <MenuIcon />
          </IconButton> : null}
          </div>
          {isMobile ? (
            <div className="flex items-center">
              <PomodoroTimer className={`justify-self-center self-center ${scrolled ? 'mr-10' : 'mr-16'}`}/>
              <div className='flex items-center gap-2'>
                {renderNotification}
              <Avatar src={profileData.image} alt="Profile" className="w-8 h-8 rounded-full mr-2" onClick={handleProfileClick}/>
              </div>
              {renderMobileMenu}
            </div>
          ) : (
            <div className="flex justify-between items-center flex-grow">
              <div className="flex items-center">
                <Link to="/boards" className="text-gray-800 dark:text-white mx-2">Boards</Link>
                <Link to="/tasks" className="text-gray-800 dark:text-white mx-2">Tasks</Link>
                <Link to="/chat" className="text-gray-800 dark:text-white mx-2">Chat</Link>
              </div>
              <PomodoroTimer/>
              <div className="flex items-center ml-4">
                {renderNotification}
                <div id="profile" className="flex items-center cursor-pointer" onClick={handleProfileClick} ref={profileRef}>
                  <Avatar src={profileData.image} alt="Profile" className="w-8 h-8 rounded-full mx-2"/>
                  { !isMobile && <span className="text-sm text-gray-800 dark:text-white">{profileData.username}</span> }
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
      {showProfile && <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg z-50">
          <button onClick={handleCloseProfile} className="absolute top-0 right-0 m-2 text-gray-800 dark:text-white">
            <Close />
          </button>
          <Profile />
        </div>
      </div>}
      {renderMessagesDialog}
    </Fragment>
  )
}

export default NaviBar
