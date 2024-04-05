import { createSlice } from '@reduxjs/toolkit';

const chatroomsSlice = createSlice({
  name: 'chatroom',
  initialState: {
    id: null,
    friend: {}, // Object which stores friend id, is_active, public_key, username
    messages: [], // Array of message objects {id, chatroom_id, chatroom_index, sender_id, content}
  },

  reducers: {
    setChatroom: (state, action) => {
      const { id, friend, messages } = action.payload;
      state.id = id;
      state.friend = friend;
      state.messages = messages;
    },
    updateFriendPublicKey: (state, action) => {
      const public_key = action.payload;
      state.friend.public_key = public_key;
    },
    addMessage: (state, action) => {
      const message = action.payload; // Object
      state.messages.push(message);
    },
    resetChatroom: (state) => {
      state.id = null;
      state.friend = {};
      state.messages = [];
    },
  },
});

export const { setChatroom, updateFriendPublicKey, addMessage, resetChatroom } = chatroomsSlice.actions;
export const selectChatroom = (state) => state.chatroom || {};
export default chatroomsSlice.reducer;
