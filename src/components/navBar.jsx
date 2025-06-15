import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DEFAULT_PROFILE_PIC } from '../utils/constants';
import { FaUserCircle, FaUsers, FaStream, FaInbox, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';

const ThemeToggle = () => {
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || getSystemTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      className="btn btn-ghost btn-circle"
      onClick={toggleTheme}
      title="Toggle dark/light mode"
    >
      {theme === 'dark' ? (
        // Sun icon for light mode
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      )}
    </button>
  );
};

const NavBar = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const user = useSelector((state) => state.user.user);
  const profilePic = user?.photoUrl || DEFAULT_PROFILE_PIC;

  if (isAuthPage) {
    // Minimal navbar for login/signup: left-aligned Devnet brand, blue-200 background, no shadow, no rounded
    return (
      <div className="w-full flex items-center py-4 px-8 bg-blue-200" style={{height: '64px'}}>
        <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-gray-800 tracking-wide">Devnet</Link>
      </div>
    );
  }

  return (
    <>
      {/* Top Navbar always visible */}
      <div className="navbar bg-blue-200 dark:bg-gray-900 shadow-md w-full px-8 flex justify-between items-center transition-colors duration-300 fixed top-0 left-0 z-50" style={{height: '64px'}}>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">Devnet</Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
      {/* Sidebar only on non-auth pages */}
      <Sidebar user={user} profilePic={profilePic} />
      {/* Spacer for navbar height */}
      <div style={{height: '64px'}}></div>
    </>
  );
}

export default NavBar