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
              className="menu menu-sm dropdown-content bg-white text-base-content rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><a>Settings</a></li>
              <li><Link to="/feed">Feed page</Link></li>
              <li>
                <Link to="/logout">Logout</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar