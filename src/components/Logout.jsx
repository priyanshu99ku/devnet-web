import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../utils/userSliece';
import axios from 'axios';
import { API_URL } from '../utils/constants';

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post(`${API_URL}/logout`);
        dispatch(logout());
        localStorage.removeItem('token'); // Remove token from localStorage
        window.location.href = '/login'; // Redirect to login page
      } catch (error) {
        console.error("Logout failed:", error);
        // Even if API call fails, clear local state for a consistent UX
        dispatch(logout());
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    performLogout();
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout; 