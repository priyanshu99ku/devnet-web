import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setToken, logout } from "../utils/userSliece";
import Body from "./Body";
import Login from "./Login";
import Profile from "./Profile";
import Logout from "./Logout";
import FeedPage from "./FeedPage";
import axios from 'axios';
import { API_URL } from '../utils/constants';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initialAuthCheck = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(logout());
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setUser(response.data));
        dispatch(setToken(token)); // Ensure token is also set in Redux state
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(logout());
          localStorage.removeItem('token'); // Clear token from localStorage on 401
          localStorage.removeItem('user'); // Clear user from localStorage on 401
        }
        console.error("Initial authentication check failed:", error);
      }
    };

    initialAuthCheck();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<div>Home Page</div>} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="feed" element={<FeedPage />} />
        </Route>
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;