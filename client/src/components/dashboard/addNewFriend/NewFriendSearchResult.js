import React, { useState, useEffect } from 'react';
import friend_requestAPI from '../../../api/friend_request';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../slices/userSlice';
import { addSentRequest } from '../../../slices/friendRequestsSlice';
import { useDispatch } from 'react-redux';
import { selectSentRequests } from '../../../slices/friendRequestsSlice';
import './NewFriendSearchResult.css';

const NewFriendSearchResult = ({ id, username }) => {
    const [isAdded, setIsAdded] = useState(true);
    const user_id = useSelector(selectUser).id;
    const dispatch = useDispatch();
    const sent_requests = useSelector(selectSentRequests);

    // Checks if there is already a pending request between user_id and id (friend's id)
    useEffect(() => {
        const checkIfRequestExists = () => {
            const requestExists = sent_requests.some((request) => request.sender_id === user_id && request.receiver_id === id && request.status === 'PENDING');
            console.log("REQUEST EXISTS: ", requestExists);
            if (requestExists) setIsAdded(true);
            else setIsAdded(false);
        };
    
        checkIfRequestExists();
    }, [sent_requests, user_id, id]);

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