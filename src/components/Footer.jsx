import { useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-blue-200 text-base-content p-4 fixed bottom-0 left-0 right-0 z-40 w-full">
      <aside className="w-full flex justify-center">
        <p className="text-gray-900">Copyright © {new Date().getFullYear()} - Priyanshu | All rights reserved.</p>
      </aside>
    </footer>
  );
}

export default Footer;
