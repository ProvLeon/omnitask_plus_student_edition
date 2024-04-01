import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import omnitaskpluslogo from '../../assets/omniTaskplusbgwhite.png';

const Header = () => {
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
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

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMobileMenuClose}>
        <ScrollLink to="features" smooth={true} duration={500}>Features</ScrollLink>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <ScrollLink to="contact" smooth={true} duration={500}>Contact</ScrollLink>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <ScrollLink to="about" smooth={true} duration={500}>About</ScrollLink>
      </MenuItem>
    </Menu>
  );

  const featureStyle = "cursor-pointer text-gray-800 dark:text-white font-black"

  return (
    <>
      <header className="bg-transparent backdrop-filter backdrop-blur-sm border-b border-gray-400 dark:border-gray-700">
        <nav className="container mx-auto flex justify-between items-center py-2">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
              <img src={omnitaskpluslogo} alt="OmniTask+" className='w-30 h-10 '/>
            </Link>
          </div>
          <div className="ml-10 space-x-4 hidden md:flex">
            <ScrollLink to="features" smooth={true} duration={500} className={featureStyle}>Features</ScrollLink>
            <ScrollLink to="contact" smooth={true} duration={500} className={featureStyle}>Contact</ScrollLink>
            <ScrollLink to="about" smooth={true} duration={500} className={featureStyle}>About</ScrollLink>
          </div>
          <div className="md:hidden">
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </nav>
      </header>
      {renderMobileMenu}
    </>
  )
}

export default Header
