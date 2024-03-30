import React from 'react';
import friendRequestAPI from '../../../api/friend_request';
import './FriendRequestReceived.css';
import { useDispatch } from 'react-redux';
import {
    removeReceivedRequest
} from '../../../slices/friendRequestsSlice';
import friendsAPI from '../../../api/friends';
import { addFriend } from '../../../slices/friendsSlice';

const FriendRequest = ({ created_at, id, receiver_id, sender_id, status }) => {
    const dispatch = useDispatch();

    const handleAcceptRequest = async (requestId, status) => {
        try {
            // First we make a request to change the friend requests status in the database
            await friendRequestAPI.changeFriendRequestStatus(requestId, status);
            // Next we update this to be reflected in the requests slice
            dispatch(removeReceivedRequest(requestId));
            // Finally we create two new entries in the friends table to make sure connection is two-way
            const friendship_info_for_sender = {
                user_id: sender_id,
                friend_id: receiver_id
            }
            const friendship_info_for_receiver = {
                user_id: receiver_id,
                friend_id: sender_id
            }
            const senders_frienship = await friendsAPI.createFriendship(friendship_info_for_sender);
            const receivers_friendship = await friendsAPI.createFriendship(friendship_info_for_receiver);
            //console.log("RECEIVERS FRIENDSHIP: ", receivers_friendship.data)
            // Finally we add the new friend for this user to their friends slice
            dispatch(addFriend({ id: receivers_friendship.data.id, friend_id: receivers_friendship.data.friend_id}));

        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectRequest = async (requestId, status) => {
        try {
            // First we make a request to change the friend requests status in the database
            await friendRequestAPI.changeFriendRequestStatus(requestId, status);
            // Next we update this to be reflected in the requests slice
            dispatch(removeReceivedRequest(requestId));
            // We don't createa a new two-way frienship as the request has been rejected
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    return (
        <div className='friend-request-received-container'>
            <p>Friend Request ID: {id}</p>
            <p>Friend request received from {sender_id} at {created_at}</p>
            <button onClick={() => handleAcceptRequest(id, 'ACCEPTED')}>
                Accept
            </button>
            <button onClick={() => handleRejectRequest(id, 'REJECTED')}>
                Reject
            </button>
        </div>
    );
};

export default FriendRequest;