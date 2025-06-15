import { useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  return (
    <footer className="absolute bottom-0 left-0 w-full z-50 bg-blue-200 dark:bg-gray-900 px-8 py-4" style={{minHeight: '64px'}}>
      <p className="text-gray-900 dark:text-white text-center w-full font-medium">
        Copyright © {new Date().getFullYear()} - Priyanshu | All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
