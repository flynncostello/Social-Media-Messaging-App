import { combineReducers } from 'redux';

import userSlice from '../slices/userSlice';
import friendsSlice from '../slices/friendsSlice';
import chatroomsSlice from '../slices/chatroomsSlice';
import friendRequestsSlice from '../slices/friendRequestsSlice';


const rootReducer = combineReducers({
    user: userSlice,
    friends: friendsSlice,
    chatrooms: chatroomsSlice,
    friendRequests: friendRequestsSlice,
});

export default rootReducer;