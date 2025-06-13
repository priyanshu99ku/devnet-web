import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { API_URL } from '../utils/constants';

const ConnectionPage = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axiosInstance.get(`${API_URL}/request/all-connections`);
        // The backend returns { message: ..., users: [...] }
        const data = response.data.users || [];
        setConnections(data);
      } catch (err) {
        console.error('Error fetching connections:', err, err.response);
        setError(err.response?.data?.message || err.response?.data?.msg || 'Failed to fetch connections');
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Connections</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {connections.length === 0 ? (
          <p className="text-lg text-gray-700">You have no connections yet.</p>
        ) : (
          <ul className="space-y-4">
            {connections.map((user) => (
              <li key={user._id || user.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md shadow-sm">
                <img
                  src={user.photoUrl || 'https://via.placeholder.com/150'}
                  alt={user.firstName || user.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{user.firstName || user.name}</h3>
                  {user.headline && <p className="text-gray-600">{user.headline}</p>}
                  {user.email && <p className="text-gray-500 text-sm">{user.email}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectionPage;