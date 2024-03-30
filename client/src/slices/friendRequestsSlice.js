import { createSlice } from '@reduxjs/toolkit';

const friendRequestSlice = createSlice({
  name: 'friendRequest',
  initialState: {
    sentRequests: [],
    receivedRequests: [],
  },
  reducers: {
    setSentRequests: (state, action) => {
      state.sentRequests = action.payload;
    },
    addSentRequest: (state, action) => {
      state.sentRequests.push(action.payload);
    },
    removeSentRequest: (state, action) => {
      const requestId = action.payload;
      state.sentRequests = state.sentRequests.filter((request) => request.id !== requestId);
    },
    clearSentRequests: (state) => {
      state.sentRequests = [];
    },
    setReceivedRequests: (state, action) => {
      state.receivedRequests = action.payload;
    },
    addReceivedRequest: (state, action) => {
      state.receivedRequests.push(action.payload);
    },
    removeReceivedRequest: (state, action) => {
      const requestId = action.payload;
      state.receivedRequests = state.receivedRequests.filter((request) => request.id !== requestId);
    },
    clearReceivedRequests: (state) => {
      state.receivedRequests = [];
    },
    clearRequests: (state) => {
        state.sentRequests = [];
        state.receivedRequests = [];
    },
  },
});

export const {
  setSentRequests,
  addSentRequest,
  removeSentRequest,
  clearSentRequests,
  setReceivedRequests,
  addReceivedRequest,
  removeReceivedRequest,
  clearReceivedRequests,
  clearRequests,
} = friendRequestSlice.actions;

export const selectSentRequests = (state) => state.friendRequests.sentRequests;
export const selectReceivedRequests = (state) => state.friendRequests.receivedRequests;

export default friendRequestSlice.reducer;