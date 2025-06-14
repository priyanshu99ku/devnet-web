import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReceivedRequests } from '../utils/receivedRequestsSlice';
import axiosInstance from '../utils/axiosConfig';
import { API_URL } from '../utils/constants';

const ReceivedRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.receivedRequests);
  const [actionError, setActionError] = useState(null);
  const [processingRequest, setProcessingRequest] = useState(null);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Received Requests</h1>
      {actionError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {actionError}
        </div>
      )}
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center">No requests received yet.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img
                    src={request.photoUrl || 'https://via.placeholder.com/80'}
                    alt={request.firstName + ' ' + request.lastName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      {request.firstName} {request.lastName}
                    </h2>
                    <p className="text-gray-600">{request.email}</p>
                    <p className="text-gray-500 text-sm">{request.about}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors ${
                      processingRequest === request.connectionId ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handleAccept(request.connectionId)}
                    disabled={processingRequest === request.connectionId}
                  >
                    {processingRequest === request.connectionId ? 'Processing...' : 'Accept'}
                  </button>
                  <button
                    className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors ${
                      processingRequest === request.connectionId ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handleReject(request.connectionId)}
                    disabled={processingRequest === request.connectionId}
                  >
                    {processingRequest === request.connectionId ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedRequests; 