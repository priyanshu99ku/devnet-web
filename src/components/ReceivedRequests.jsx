import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReceivedRequests } from '../utils/receivedRequestsSlice';
import axiosInstance from '../utils/axiosConfig';
import { API_URL } from '../utils/constants';
import ReactDOM from 'react-dom';

const ReceivedRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.receivedRequests);
  const [actionError, setActionError] = useState(null);
  const [processingRequest, setProcessingRequest] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchReceivedRequests());
  }, [dispatch]);

  const handleAccept = async (connectionId) => {
    try {
      setProcessingRequest(connectionId);
      setActionError(null);
      const response = await axiosInstance.post(`${API_URL}/request/review/accepted/${connectionId}`);
      dispatch(fetchReceivedRequests());
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to accept request');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async (connectionId) => {
    try {
      setProcessingRequest(connectionId);
      setActionError(null);
      await axiosInstance.post(`${API_URL}/request/review/rejected/${connectionId}`);
      dispatch(fetchReceivedRequests());
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessingRequest(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101624] py-8 px-2 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-white dark:text-white">Received Requests</h1>
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
            {actionError}
          </div>
        )}
        {requests.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 text-center">No requests received yet.</p>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="flex flex-col sm:flex-row justify-between items-center bg-[#232b3b] rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-200 hover:shadow-2xl hover:border-blue-400 border border-transparent cursor-pointer group"
                onClick={() => setSelectedUser(request)}
              >
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <img
                    src={request.photoUrl || 'https://via.placeholder.com/80'}
                    alt={request.firstName + ' ' + request.lastName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 group-hover:border-blue-400 transition"
                  />
                  <div>
                    <h2 className="text-xl font-bold mb-1 text-white">
                      {request.firstName} {request.lastName}
                    </h2>
                    <p className="text-gray-200 font-medium">{request.email}</p>
                    <p className="text-gray-300 text-sm">{request.about || 'No information provided.'}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0 sm:ml-4" onClick={e => e.stopPropagation()}>
                  <button
                    className={`px-5 py-2 rounded-lg font-semibold shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-500 hover:bg-green-600 text-white disabled:opacity-60 disabled:cursor-not-allowed`}
                    onClick={() => handleAccept(request.connectionId)}
                    disabled={processingRequest === request.connectionId}
                  >
                    {processingRequest === request.connectionId ? 'Processing...' : 'Accept'}
                  </button>
                  <button
                    className={`px-5 py-2 rounded-lg font-semibold shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-500 hover:bg-red-600 text-white disabled:opacity-60 disabled:cursor-not-allowed`}
                    onClick={() => handleReject(request.connectionId)}
                    disabled={processingRequest === request.connectionId}
                  >
                    {processingRequest === request.connectionId ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedUser && ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80" onClick={() => setSelectedUser(null)}>
            <div className="bg-white dark:bg-[#232b3b] rounded-2xl shadow-2xl p-8 w-full max-w-md relative text-gray-900 dark:text-white mx-2" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-3xl font-bold focus:outline-none"
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
                <h2 className="text-2xl font-bold mb-1 text-center">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <p className="text-base text-gray-700 dark:text-gray-200 mb-2 text-center">{selectedUser.email}</p>
                {selectedUser.headline && (
                  <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">{selectedUser.headline}</p>
                )}
                <div className="mb-2 w-full">
                  <h3 className="font-semibold text-lg">About:</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedUser.about || "No information provided."}
                  </p>
                </div>
                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div className="mb-2 w-full">
                    <h3 className="font-semibold text-lg">Skills:</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {Array.isArray(selectedUser.skills) ? selectedUser.skills.join(', ') : selectedUser.skills}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default ReceivedRequests; 