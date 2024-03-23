import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { Icon } from '@mui/material';
import { MaterialUISwitch } from './MUI';
import { NotificationsOutlined } from '@mui/icons-material';

const Header = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'light');
  const storedTheme = localStorage.getItem('theme');
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  useEffect(() => {
    const selectedTheme = storedTheme ? storedTheme : prefersDarkMode ? 'dark' : 'light';

    document.documentElement.classList.add(`${selectedTheme}`);
    setTheme(selectedTheme);
    // localStorage.setItem('theme', selectedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.add(`${newTheme}`);
    document.documentElement.classList.remove(`${theme}`);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 80) {
          header.classList.add('fixed', 'top-2', 'left-[15%]', 'w-[70%]', 'z-50', 'backdrop-filter', 'backdrop-blur-lg', 'shadow-lg', 'rounded-lg', 'border', 'border-gray-200', 'px-4');
          header.style.transition = 'all 0.5s ease-in';
        } else {
          header.classList.remove('fixed', 'top-2', 'left-[15%]', 'w-[70%]', 'z-50', 'backdrop-filter', 'backdrop-blur-lg', 'shadow-lg', 'rounded-lg', 'border', 'border-gray-200', 'px-4');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="bg-transparent backdrop-filter backdrop-blur-sm border-b border-gray-400 dark:border-gray-700">
      <nav className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">OmniTask+</Link>
          <div className="ml-10 space-x-4">
            <Link to="/boards" className="text-gray-800 dark:text-white">Boards</Link>
            <Link to="/tasks" className="text-gray-800 dark:text-white">Tasks</Link>
            <Link to="/chat" className="text-gray-800 dark:text-white">Chat</Link>
          </div>
        </div>
        <div className="flex items-center">
            <MaterialUISwitch onClick={toggleTheme} className='mr-4'/>
          <div className="relative mr-4 cursor-pointer">
            <span className="absolute right-0 top-0 rounded-[100px] w-4 h-4 text-center bg-red-500 text-white text-xs">3</span>
            <NotificationsOutlined className=' text-gray-800 dark:text-white w-10 h-10'/>
          </div>
          <div className="flex items-center cursor-pointer">
            <img src="https://images.unsplash.com/photo-1531727991582-cfd25ce79613?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile" className="w-8 h-8 rounded-full mr-2"/>
            <span className="text-sm text-gray-800 dark:text-white">ProvLeon</span>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
