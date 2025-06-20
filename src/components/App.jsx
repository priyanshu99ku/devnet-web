import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setToken, logout } from "../utils/userSliece";
import Body from "./Body";
import Login from "./Login";
import Profile from "./Profile";
import Logout from "./Logout";
import FeedPage from "./FeedPage";
import EditProfile from "./EditProfile";
import ConnectionPage from "./ConnectionPage";
import ReceivedRequests from "./ReceivedRequests";
import ChatPage from "./ChatPage";
import axios from 'axios';
import { API_URL } from '../utils/constants';

// This is the main component of my app. It handles routing and initial authentication.
function App() {
  const dispatch = useDispatch();

  // The Redux store is now hydrated from localStorage, so we just need to
  // re-validate the session in the background to keep the data fresh.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const revalidate = async () => {
        try {
          const response = await axios.get(`${API_URL}/user`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          });
          const freshUser = response.data;
          dispatch(setUser(freshUser));
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch (error) {
          if (error.response?.status === 401) {
            // The token is no longer valid
            dispatch(logout());
          }
          console.error("Background session re-validation failed:", error);
        }
      };
      revalidate();
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<div>Home Page</div>} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="connections" element={<ConnectionPage />} />
          <Route path="received-requests" element={<ReceivedRequests />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:userId" element={<ChatPage />} />
        </Route>
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;