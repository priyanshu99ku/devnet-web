import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaUsers, FaStream, FaInbox, FaSignOutAlt, FaComments } from 'react-icons/fa';

const Sidebar = ({ user, profilePic }) => {
  const location = useLocation();
  const navLinks = [
    { to: '/profile', label: 'Profile', icon: <FaUserCircle size={22} /> },
    { to: '/connections', label: 'Connection Page', icon: <FaUsers size={22} /> },
    { to: '/feed', label: 'Feed page', icon: <FaStream size={22} /> },
    { to: '/received-requests', label: 'Request Feed', icon: <FaInbox size={22} /> },
    { to: '/chat', label: 'Chat', icon: <FaComments size={22} /> },
  ];

  return (
    <aside className="h-screen w-56 bg-white dark:bg-gray-900 shadow-lg flex flex-col justify-between pt-24 pb-24 px-4 fixed left-0 top-0 z-40 overflow-y-auto">
      <nav className="flex flex-col gap-2 mt-2">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-800 transition-colors${location.pathname === link.to ? ' bg-blue-100 dark:bg-gray-800' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="flex flex-col items-center gap-2 mt-8">
        <img
          src={profilePic}
          alt="User profile"
          className="w-14 h-14 rounded-full border-2 border-blue-400 mb-1 object-cover"
        />
        <span className="text-base font-semibold text-gray-900 dark:text-white mb-2">{user?.firstName || user?.name || 'User'}</span>
        <Link
          to="/logout"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
        >
          <FaSignOutAlt size={20} />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar; 