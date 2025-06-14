import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DEFAULT_PROFILE_PIC } from '../utils/constants';

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
  const isLoginPage = location.pathname === '/login';
  const user = useSelector((state) => state.user.user);

  const profilePic = user?.photoUrl || DEFAULT_PROFILE_PIC;

  return (
    <div className="navbar bg-blue-200 dark:bg-gray-900 shadow-md w-full px-8 flex justify-between items-center transition-colors duration-300">
      <div className="flex items-center gap-4">
        <a className="text-2xl font-bold text--color-base-content">Devnet</a>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {!isLoginPage && (
          <div className="dropdown dropdown-end mx-3.5">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  alt="User profile picture"
                  src={profilePic}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-xl z-10 mt-3 w-56 p-3 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              <li>
                <Link to="/profile" className="px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-800 font-medium transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/connections" className="px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-800 font-medium transition-colors">Connection Page</Link>
              </li>
              <li>
                <Link to="/feed" className="px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-800 font-medium transition-colors">Feed page</Link>
              </li>
              <li>
                <Link to="/received-requests" className="px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-800 font-medium transition-colors">Request Feed</Link>
              </li>
              <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
              <li>
                <Link to="/logout" className="px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 font-medium transition-colors">Logout</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar