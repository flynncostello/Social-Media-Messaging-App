// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
 name: 'user',
 initialState: {
    id: null,
    username: null,
    is_active: false,
 },
 reducers: {
    setUser: (state, action) => {
        const { id, username, is_active } = action.payload;
        state.id = id;
        state.username = username;
        state.is_active = is_active;
    },
    updateUser: (state, action) => {
        const { id, username, is_active } = action.payload;
        state.id = id;
        state.username = username;
        state.is_active = is_active;
    },
    clearUserSlice: (state) => {
        state.id = null;
        state.username = null;
        state.is_active = false;
    },
 },
});

export const { setUser, updateUser, clearUserSlice } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;