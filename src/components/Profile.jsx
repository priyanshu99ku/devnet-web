import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import { setUser } from '../utils/userSliece';

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(false);
        return; // User data already in Redux store, no need to fetch
      }

      try {
        setLoading(true);
        // Assuming you have a /user endpoint to fetch user data
        // You might need to send a token for authorization
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setUser(response.data));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-2">Profile Page</h2>
      {user ? (
        <div className="text-center">
          <p className="text-base text-gray-600">Welcome, {user.name || user.email}!</p>
          {user.photoUrl && <img src={user.photoUrl} alt="Profile" className="w-24 h-24 rounded-full mx-auto my-4" />}
          {/* Add more user details here */}
        </div>
      ) : (
        <p className="text-base text-gray-600">User data not available.</p>
      )}
    </div>
  );
}

export default Profile;
