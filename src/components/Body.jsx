import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import NavBar from "./navBar";
import Footer from "./Footer";

const Body = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 flex flex-col justify-center items-center p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
