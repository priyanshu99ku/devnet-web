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

  // On component mount, I check if there's a token in localStorage to keep the user logged in.
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
        dispatch(setToken(token)); // I'm making sure the token is also set in my Redux state.
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(logout());
          localStorage.removeItem('token'); // If auth fails, I clear the token from localStorage.
          localStorage.removeItem('user'); // And the user data too.
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