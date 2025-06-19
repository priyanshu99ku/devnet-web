import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed, setLoading, setError } from '../utils/feedslice';
import { FEED_API, API_URL } from '../utils/constants';
import axiosInstance from '../utils/axiosConfig';

// This is my main feed page, where I can discover other developers.
const FeedPage = () => {
  const dispatch = useDispatch();
  const { feed, loading, error } = useSelector((state) => state.feed);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [errorState, setErrorState] = useState(null);
  const [interestedDisabled, setInterestedDisabled] = useState(false);

  // I'm fetching the list of users for my feed when the component loads.
  useEffect(() => {
    const fetchFeed = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axiosInstance.get(FEED_API);
        // I store the fetched users in my Redux state.
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

  // These functions let me cycle through the user cards.
  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % feed.length);
  };

  // I'm navigating to the previous card in the feed.
  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + feed.length) % feed.length);
  };

  // When I click 'Interested', I send a request to the backend to register my interest in this user.
  const handleInterested = async () => {
    const userId = feed[currentCardIndex]._id || feed[currentCardIndex].id;
    setInterestedDisabled(true); // I disable the button to prevent multiple clicks.
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

  // I'm showing different messages depending on the state of the feed.
  if (loading) return <div className="text-center text-xl font-bold py-10">Loading Users...</div>;
  if (error) return <div className="text-center text-red-500 text-xl font-bold py-10">Error: {error}</div>;
  if (!feed || feed.length === 0) return <div className="text-center text-gray-500 text-xl font-bold py-10">No users to show.</div>;

    // This gets the user data for the card that's currently visible.
  const currentCard = feed[currentCardIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6">
      <div className="w-80 h-[450px] relative">
        {currentCard && (
          <div key={currentCard.email} className="w-full h-full bg-black rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8">
            <img
              src={currentCard.imageUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
              alt={`${currentCard.firstName} ${currentCard.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow mb-4"
            />
            <h2 className="text-2xl font-bold text-white mb-1 text-center">{`${currentCard.firstName} ${currentCard.lastName}`}</h2>
            <p className="text-base text-white mb-2 text-center">{currentCard.email}</p>
            <div className="mb-4 w-full">
              <h3 className="font-semibold text-lg text-white">About:</h3>
              <p className="text-sm text-white">
                {currentCard.about || "No information provided."}
              </p>
            </div>
            <button 
              onClick={handleInterested}
              className="btn btn-primary btn-lg w-full mt-2"
              disabled={interestedDisabled}
            >
              Interested
            </button>
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