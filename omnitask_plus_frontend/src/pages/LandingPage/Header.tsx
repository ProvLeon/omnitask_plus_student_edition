import { Link } from 'react-router-dom';
import { /*useState,*/ useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';

const Header = () => {
  // const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'light');

  // const storedTheme = localStorage.getItem('theme');
  // const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // useEffect(() => {
  //   const selectedTheme = storedTheme ? storedTheme : prefersDarkMode ? 'dark' : 'light';

  //   document.documentElement.classList.add(`${selectedTheme}`);
  //   setTheme(selectedTheme);
  // }, []);

  // const toggleTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light';
  //   document.documentElement.classList.add(`${newTheme}`);
  //   document.documentElement.classList.remove(`${theme}`);
  //   setTheme(newTheme);
  //   localStorage.setItem('theme', newTheme);
  // };

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

  const featureStyle = "cursor-pointer text-gray-800 dark:text-white font-black"

  return (
    <>
      <header className="bg-transparent backdrop-filter backdrop-blur-sm border-b border-gray-400 dark:border-gray-700">
        <nav className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">OmniTask+</Link>
          </div>
            <div className="ml-10 space-x-4">
              <ScrollLink to="features" smooth={true} duration={500} className={featureStyle}>Features</ScrollLink>
              <ScrollLink to="contact" smooth={true} duration={500} className={featureStyle}>Contact</ScrollLink>
              <ScrollLink to="about" smooth={true} duration={500} className={featureStyle}>About</ScrollLink>
            </div>
        </nav>
      </header>
    </>
  )
}

export default Header
