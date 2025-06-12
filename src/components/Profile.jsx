import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../utils/userSliece';
import { API_URL, DEFAULT_PROFILE_PIC } from '../utils/constants';
import axiosInstance from '../utils/axiosConfig'; // Use the configured axios instance

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      // If user data is already in Redux, use it. Otherwise, try to fetch.
      if (user && user._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use axiosInstance which includes token handling
        const response = await axiosInstance.get(`${API_URL}/user`);
        dispatch(setUser(response.data));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(err.response?.data?.message || "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, user]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4">Loading profile...</p>
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-focus py-10">
      <div className="card w-96 bg-neutral shadow-xl">
        <figure className="px-10 pt-10">
          <img 
            src={user?.photoUrl || DEFAULT_PROFILE_PIC} 
            alt="Profile Picture"
            className="w-32 h-32 rounded-full object-cover mx-auto ring ring-primary ring-offset-neutral ring-offset-2"
          />
        </figure>
        <div className="card-body items-center text-center p-6 text-neutral-content">
          <h2 className="card-title text-3xl">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-lg opacity-90">{user?.email}</p>

          <div className="text-left w-full mt-4">
            <p><span className="font-semibold">Age:</span> {user?.age || 'N/A'}</p>
            <p><span className="font-semibold">Gender:</span> {user?.gender || 'N/A'}</p>
            <p className="mt-2"><span className="font-semibold">About:</span> {user?.about || 'No information provided.'}</p>
            <p className="mt-2"><span className="font-semibold">Skills:</span> {user?.skills?.length ? user.skills.join(', ') : 'N/A'}</p>
          </div>

          <div className="card-actions justify-center mt-6">
            <button className="btn btn-primary" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
