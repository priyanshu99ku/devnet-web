import React from 'react'

const NavBar = () => {
  return (
    <div className="navbar bg-blue-200 shadow-md w-full px-8 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <a className="text-2xl font-bold text--color-base-content">Devnet</a>
      </div>
      <div className="flex items-center gap-4">
        <div className="dropdown dropdown-end mx-3.5">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white text-base-content rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NavBar