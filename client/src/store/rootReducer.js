import { combineReducers } from 'redux';

import userSlice from '../slices/userSlice';
import friendsSlice from '../slices/friendsSlice';
import chatroomSlice from '../slices/chatroomSlice';
import friendRequestsSlice from '../slices/friendRequestsSlice';


const rootReducer = combineReducers({
    user: userSlice,
    friends: friendsSlice,
    chatroom: chatroomSlice,
    friendRequests: friendRequestsSlice,
});

export default rootReducer;