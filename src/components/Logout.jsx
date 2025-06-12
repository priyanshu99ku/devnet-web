import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../utils/userSliece';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post(`${API_URL}/logout`, {}, {
          withCredentials: true
        });
        dispatch(logout());
        navigate('/login', { replace: true });
      } catch (error) {
        console.error("Logout failed:", error);
        dispatch(logout());
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout; 