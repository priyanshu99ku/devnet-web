import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed, setLoading, setError } from '../utils/feedslice';
import { logout } from '../utils/userSliece';
import { FEED_API } from '../utils/constants';
import axiosInstance from '../utils/axiosConfig';

const FeedPage = () => {
  const dispatch = useDispatch();
  const { feed, loading, error } = useSelector((state) => state.feed);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feed.map((item, index) => (
          <div key={index} className="card card-side bg-base-100 shadow-sm">
            <figure>
              <img
                src={item.imageUrl || "https://img.daisyui.com/images/stock/photo-1635805737707-53994a69daeb.webp"}
                alt={`${item.firstName} ${item.lastName}`} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{`${item.firstName} ${item.lastName}`}</h2>
              <p>{item.email}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Watch</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage; 