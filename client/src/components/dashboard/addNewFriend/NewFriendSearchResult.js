import React, { useState } from 'react';
import friend_requestAPI from '../../../api/friend_request';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../slices/userSlice';
import { addSentRequest } from '../../../slices/friendRequestsSlice';
import { useDispatch } from 'react-redux';
import './NewFriendSearchResult.css';

const NewFriendSearchResult = ({ id, username }) => {
    const [isAdded, setIsAdded] = useState(false);
    const user_id = useSelector(selectUser).id;
    const dispatch = useDispatch();

    const handleAddFriend = async () => {
        try {
            const new_request = await friend_requestAPI.sendFriendRequest(user_id, id);
            dispatch(addSentRequest(new_request));
            setIsAdded(true);
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    return (
        <div>
            <span>{username}</span>
            {!isAdded && <button onClick={handleAddFriend}>Add</button>}
        </div>
    );
};

export default NewFriendSearchResult;