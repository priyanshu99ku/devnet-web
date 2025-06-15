import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-5 px-4 flex justify-center items-center border-t border-gray-800 shadow-lg">
      <span className="text-center w-full text-sm font-medium tracking-wide">
        &copy; {new Date().getFullYear()} Priyanshu. All rights reserved.
      </span>
    </footer>
  );
}

export default Footer;
