import { createSlice } from '@reduxjs/toolkit';

const friendsSlice = createSlice({
  name: 'friends',
  initialState: [],
  reducers: {
    setFriends: (state, action) => {
        const friends = action.payload
        return friends; // Return a new array
    },
    addFriend: (state, action) => {
        const newFriend = action.payload;
        if (!state.includes(newFriend)) {
            state.push(newFriend); // This is fine because it's a mutable operation on a draft
        }
    },
    removeFriend: (state, action) => {
        const friendId = action.payload.friend_id;
        return state.filter((friendship) => friendship.friend_id !== friendId);
    },
  },
});

export const { setFriends, addFriend, removeFriend, updateFriend } = friendsSlice.actions;
export const selectFriends = (state) => state.friends;
export default friendsSlice.reducer;
