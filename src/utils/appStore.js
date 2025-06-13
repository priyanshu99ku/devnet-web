import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSliece';
import feedReducer from './feedslice';
import receivedRequestsReducer from './receivedRequestsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    receivedRequests: receivedRequestsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
