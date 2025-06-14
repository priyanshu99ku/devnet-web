import React from 'react'
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DEFAULT_PROFILE_PIC } from '../utils/constants';

const NavBar = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const user = useSelector((state) => state.user.user);

  const profilePic = user?.photoUrl || DEFAULT_PROFILE_PIC;

  return (
    <div className="navbar bg-blue-200 shadow-md w-full px-8 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <a className="text-2xl font-bold text--color-base-content">Devnet</a>
      </div>
      <div className="flex items-center gap-4">
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
              className="menu menu-sm dropdown-content bg-white text-base-content rounded-xl z-10 mt-3 w-56 p-3 shadow-lg border border-gray-200"
            >
              <li>
                <Link to="/profile" className="px-3 py-2 rounded-lg hover:bg-blue-100 font-medium transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/connections" className="px-3 py-2 rounded-lg hover:bg-blue-100 font-medium transition-colors">Connection Page</Link>
              </li>
              <li>
                <Link to="/feed" className="px-3 py-2 rounded-lg hover:bg-blue-100 font-medium transition-colors">Feed page</Link>
              </li>
              <li>
                <Link to="/received-requests" className="px-3 py-2 rounded-lg hover:bg-blue-100 font-medium transition-colors">Request Feed</Link>
              </li>
              <div className="my-2 border-t border-gray-200"></div>
              <li>
                <Link to="/logout" className="px-3 py-2 rounded-lg hover:bg-red-100 text-red-600 font-medium transition-colors">Logout</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar