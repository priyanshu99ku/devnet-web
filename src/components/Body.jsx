import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import NavBar from "./navBar";
import Footer from "./Footer";

const Body = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    if (!isAuthenticated && !isAuthPage) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, isAuthPage]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-1 flex flex-col justify-center items-center p-4 transition-all duration-300 relative">
        <NavBar />
        <main className={`${!isAuthPage ? 'ml-56 mt-16' : ''} w-full flex flex-col items-center`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Body;
