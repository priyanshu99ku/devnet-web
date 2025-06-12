import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSliece';
import feedReducer from './feedslice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
