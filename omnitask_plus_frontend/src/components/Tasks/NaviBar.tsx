import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, Fragment } from 'react';
import { IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, NotificationsOutlined, Close } from '@mui/icons-material';
import Profile from '../SmallComponents/Profile';
import { getUserData } from '../apis/UserApi';
import { subscribe } from '../../utils/pubSub';
import PomodoroTimer from '../SmallComponents/PomodoroTimer';
import logo from '../../assets/omniTaskplusbgwhite.png'

interface ProfileData {
  username: string;
  image: string;
}

const NaviBar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const profileRef = useRef(null);

  const [profileData, setProfileData] = useState({
    username: '',
    image: '',
  });

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


  const handleProfileClick = () => {
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
      <div className='relative cursor-pointer mr-2'>
        <span className='absolute right-0 top-0 rounded-full w-4 h-4 text-center bg-red-500 text-white text-xs'>3</span>
        <NotificationsOutlined className='text-gray-800 dark:text-white w-10 h-10'/>
      </div>
    </div>
  )

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
              <img src={profileData.image} alt="Profile" className="w-8 h-8 rounded-full mr-2" onClick={handleProfileClick}/>
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
                  <img src={profileData.image} alt="Profile" className="w-8 h-8 rounded-full mx-2"/>
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
    </Fragment>
  )
}

export default NaviBar
