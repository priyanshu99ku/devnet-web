import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  feed: [],
  loading: false,
  error: null,
  connections: [],
  receivedConnections: [],
  connectionRequestSent: false,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (state, action) => {
      state.feed = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearFeed: (state) => {
      state.feed = [];
      state.loading = false;
      state.error = null;
    },
    setConnections: (state, action) => {
      state.connections = action.payload;
    },
    setReceivedConnections: (state, action) => {
      state.receivedConnections = action.payload;
    },
    sendConnectionRequest: (state) => {
      state.connectionRequestSent = true;
    },
  },
});

export const { setFeed, setLoading, setError, clearFeed, setConnections, setReceivedConnections, sendConnectionRequest } = feedSlice.actions;
export default feedSlice.reducer;
