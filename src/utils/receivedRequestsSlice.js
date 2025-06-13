import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosConfig';
import { API_URL } from './constants';

export const fetchReceivedRequests = createAsyncThunk(
  'receivedRequests/fetchReceivedRequests',
  async () => {
    const response = await axiosInstance.get(`${API_URL}/request/received-users`);
    return response.data.users;
  }
);

const receivedRequestsSlice = createSlice({
  name: 'receivedRequests',
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRequests: (state) => {
      state.requests = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceivedRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchReceivedRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearRequests } = receivedRequestsSlice.actions;
export default receivedRequestsSlice.reducer; 