import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSliece';
import feedReducer from './feedslice';
import receivedRequestsReducer from './receivedRequestsSlice';

// Load user state from localStorage for rehydration
const loadUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!serializedUser || !token) return undefined;

    const user = JSON.parse(serializedUser);
    // This becomes the preloaded state for the user slice
    return {
      user: {
        user,
        token,
        isAuthenticated: true,
        loading: false, // Not loading, as we have the session data
        error: null,
      },
    };
  } catch (e) {
    console.warn("Could not load user state from localStorage", e);
    return undefined;
  }
};

const preloadedState = loadUserFromStorage();

export const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    receivedRequests: receivedRequestsReducer,
  },
  preloadedState, // Set the preloaded state here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
