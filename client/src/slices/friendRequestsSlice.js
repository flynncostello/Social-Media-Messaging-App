import { createSlice } from '@reduxjs/toolkit';
import React from 'react';

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
      const pendingRequests = action.payload.filter(item => item.status.toLowerCase() === 'pending');
      return {
        ...state,
        receivedRequests: pendingRequests
      };
    },
    addReceivedRequest: (state, action) => {
      const receivedRequest = action.payload;
      const isPending = receivedRequest.status && receivedRequest.status.toLowerCase() === 'pending';
      if (isPending) {
        return {
          ...state,
          receivedRequests: [...state.receivedRequests, receivedRequest]
        };
      }
      return state; 
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