import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { API_URL } from '../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { setConnections } from '../utils/feedslice';
import { useNavigate } from 'react-router-dom';

const ConnectionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connections = useSelector((state) => state.feed.connections);
  const [loading, setLoading] = useState(connections.length === 0);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const USERS_PER_PAGE = 5;
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (connections.length === 0) {
      const fetchConnections = async () => {
        try {
          const response = await axiosInstance.get(`${API_URL}/request/all-connections`);
          const data = response.data.users || [];
          dispatch(setConnections(data));
        } catch (err) {
          setError(err.response?.data?.message || err.response?.data?.msg || 'Failed to fetch connections');
        } finally {
          setLoading(false);
        }
      };
      fetchConnections();
    } else {
      setLoading(false);
    }
  }, [connections, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <span className="loading loading-spinner loading-lg text-blue-700 dark:text-white"></span>
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#101624]">
      <h1 className="text-5xl font-bold mb-8 text-center text-white">Connections</h1>
      <div className="w-full max-w-md bg-[#161d2a] rounded-lg shadow-md p-6">
        {connections.length === 0 ? (
          <p className="text-lg text-white">You have no connections yet.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {connections.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE).map((user) => (
                <li
                  key={user._id || user.id}
                  className="flex items-center space-x-4 p-3 bg-gray-700 rounded-md shadow-sm cursor-pointer hover:bg-blue-800 transition-colors"
                  onClick={() => setSelectedUser(user)}
                >
                  <img
                    src={user.photoUrl || 'https://via.placeholder.com/150'}
                    alt={user.firstName || user.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">{user.firstName || user.name}</h3>
                    {user.headline && <p className="text-gray-300">{user.headline}</p>}
                    {user.email && <p className="text-gray-400 text-sm">{user.email}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-6">
              <button
                className={`btn px-6 py-2 font-semibold rounded-md transition-colors duration-200 
                  ${page === 1 ? 'bg-red-200 text-red-500 border border-red-200 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white border-none'}`}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-white px-4">Page {page} of {Math.ceil(connections.length / USERS_PER_PAGE)}</span>
              <button
                className={`btn px-6 py-2 font-semibold rounded-md transition-colors duration-200 
                  ${page === Math.ceil(connections.length / USERS_PER_PAGE) ? 'bg-red-200 text-red-500 border border-red-200 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white border-none'}`}
                onClick={() => setPage((p) => Math.min(Math.ceil(connections.length / USERS_PER_PAGE), p + 1))}
                disabled={page === Math.ceil(connections.length / USERS_PER_PAGE)}
              >
                Next
              </button>
            </div>
            {/* User Modal (overlay only content area, not navbar/footer) */}
            {selectedUser && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
                    onClick={() => setSelectedUser(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <div className="flex flex-col items-center">
                    <img
                      src={selectedUser.photoUrl || 'https://via.placeholder.com/150'}
                      alt={selectedUser.firstName || selectedUser.name || 'User'}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow mb-4"
                    />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 text-center">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h2>
                    <p className="text-base text-gray-600 dark:text-gray-300 mb-2 text-center">{selectedUser.email}</p>
                    {selectedUser.headline && (
                      <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">{selectedUser.headline}</p>
                    )}
                    <div className="mb-2 w-full">
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white">About:</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {selectedUser.about || "No information provided."}
                      </p>
                    </div>
                    {selectedUser.skills && selectedUser.skills.length > 0 && (
                      <div className="mb-2 w-full">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Skills:</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          {Array.isArray(selectedUser.skills) ? selectedUser.skills.join(', ') : selectedUser.skills}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        navigate(`/chat/${selectedUser._id}`);
                        setSelectedUser(null);
                      }}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionPage;