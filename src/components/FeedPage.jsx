import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed, setLoading, setError } from '../utils/feedslice';
import { FEED_API, API_URL } from '../utils/constants';
import axiosInstance from '../utils/axiosConfig';

const FeedPage = () => {
  const dispatch = useDispatch();
  const { feed, loading, error } = useSelector((state) => state.feed);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [errorState, setErrorState] = useState(null);
  const [interestedDisabled, setInterestedDisabled] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axiosInstance.get(FEED_API);
        dispatch(setFeed(response.data.users));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };

    fetchFeed();
  }, [dispatch]);

  useEffect(() => {
    setInterestedDisabled(false);
  }, [currentCardIndex]);

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % feed.length);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + feed.length) % feed.length);
  };

  const handleInterested = async () => {
    const userId = feed[currentCardIndex]._id || feed[currentCardIndex].id;
    setInterestedDisabled(true);
    console.log('Sending interested request for userId:', userId);
    try {
      const response = await axiosInstance.post(`${API_URL}/request/sendInterestedUser`, {
        interestedUserId: userId
      });
      console.log('Interested API response:', response);
      setErrorState(null);
    } catch (err) {
      console.error('Error sending interested request:', err, err.response);
      setErrorState(err.response?.data?.message || err.message || 'Failed to send interested request.');
    }
  };

  if (loading) return <div className="text-center text-xl font-bold py-10">Loading Users...</div>;
  if (error) return <div className="text-center text-red-500 text-xl font-bold py-10">Error: {error}</div>;
  if (!feed || feed.length === 0) return <div className="text-center text-gray-500 text-xl font-bold py-10">No users to show.</div>;

  const currentCard = feed[currentCardIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-300 py-6">
      <h1 className="text-3xl font-bold mb-8">Discover Users</h1>
      <div className="w-80 h-[450px] relative">
        {currentCard && (
          <div key={currentCard.email} className="card w-full h-full bg-base-100 shadow-xl image-full">
            <figure>
              <img
                src={currentCard.imageUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                alt={`${currentCard.firstName} ${currentCard.lastName}`}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body p-6 flex flex-col justify-end text-white">
              <h2 className="card-title text-3xl">{`${currentCard.firstName} ${currentCard.lastName}`}</h2>
              <p className="text-lg">{currentCard.email}</p>
              <div className="mt-2 mb-4">
                <h3 className="font-semibold text-xl">About:</h3>
                <p className="text-sm opacity-90">
                  {currentCard.about || "No bio available. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                </p>
              </div>
              <div className="card-actions justify-center space-x-4 mt-auto">
                <button 
                  onClick={handleInterested}
                  className="btn btn-primary btn-lg"
                  disabled={interestedDisabled}
                >
                  Interested
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between w-80 mt-4">
        <button onClick={handlePrevCard} className="btn btn-primary" disabled={feed.length <= 1}>Previous</button>
        <button onClick={handleNextCard} className="btn btn-primary" disabled={feed.length <= 1}>Next</button>
      </div>
    </div>
  );
};

export default FeedPage; 