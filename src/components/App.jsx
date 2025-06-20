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
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        // Optimistically set the user as authenticated from localStorage
        dispatch(setUser(user));
        dispatch(setToken(token));

        // Asynchronously re-validate the token with the server
        const revalidateToken = async () => {
          try {
            const response = await axios.get(`${API_URL}/user`, {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            // Update user data with fresh data from the server
            const freshUser = response.data;
            dispatch(setUser(freshUser));
            localStorage.setItem('user', JSON.stringify(freshUser));
          } catch (error) {
            if (error.response?.status === 401) {
              // Token is invalid, log the user out
              dispatch(logout());
            }
            console.error("Token revalidation failed:", error);
          }
        };
        revalidateToken();
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        dispatch(logout());
      }
    } else {
      // If no token/user in localStorage, ensure we are logged out.
      dispatch(logout());
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