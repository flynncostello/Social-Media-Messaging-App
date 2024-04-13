import { createSlice } from '@reduxjs/toolkit';

const friendsSlice = createSlice({
  name: 'friends',
  initialState: {}, // Object with keys = friendship_id, and values = friend_id
  reducers: {
    setFriends: (state, action) => { // action.payload is an array of objects each containing friends info
        const friends = action.payload
        if (friends.length > 0) {
            friends.forEach((friend) => {
                state[friend.id] = friend.friend_id;
            });
        };
    },
    addFriend: (state, action) => {
        const newFriendId = action.payload.friend_id; // action.payload is an object containing friend's info as well as friend_ship id
        const newFriendshipId = action.payload.id;
        if (!state[newFriendshipId]) {
            state[newFriendshipId] = newFriendId;
        }
    },
    removeFriend: (state, action) => { // action.payload is friendship_id
        const friendship_id = action.payload;
        delete state[friendship_id];
    },
    clearFriendsSlice: (state) => {
        return {};
    },
  },
});

export const { setFriends, addFriend, removeFriend, clearFriendsSlice } = friendsSlice.actions;
export const selectFriends = (state) => state.friends;
export default friendsSlice.reducer;
