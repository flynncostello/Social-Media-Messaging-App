// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
 name: 'user',
 initialState: {
    id: null,
    username: null,
    password: null,
    is_active: false,
 },
 reducers: {
    setUser: (state, action) => {
        const { id, username, password, is_active } = action.payload;
        state.id = id;
        state.username = username;
        state.password = password;
        state.is_active = is_active;
    },
    updateUser: (state, action) => {
        const { id, username, password, is_active } = action.payload;
        state.id = id;
        state.username = username;
        state.password = password;
        state.is_active = is_active;
    }
 },
});

export const { setUser, updateUser } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;