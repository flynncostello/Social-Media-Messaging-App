// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
 name: 'user',
 initialState: {
    id: null,
    username: null,
    is_active: false,
    public_key: null,
 },
 reducers: {
    setUser: (state, action) => {
        const { id, username, is_active, public_key } = action.payload;
        state.id = id;
        state.username = username;
        state.is_active = is_active;
        state.public_key = public_key
    },
    updateUser: (state, action) => {
        const { id, username, is_active, public_key } = action.payload;
        state.id = id;
        state.username = username;
        state.is_active = is_active;
        state.public_key = public_key
    },
    clearUserSlice: (state) => {
        state.id = null;
        state.username = null;
        state.is_active = false;
        state.public_key = null;
    },
 },
});

export const { setUser, updateUser, clearUserSlice } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;