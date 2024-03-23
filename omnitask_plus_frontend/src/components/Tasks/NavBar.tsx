import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className='h-full flex flex-col justify-center items-center'>
      <Link to="/dashboard">Dashboards</Link>
      <Link to="/Boards">Boards</Link>
    </div>
  );
};

export default NavBar;
