import React, { useState, useEffect } from 'react';
import friendRequestAPI from '../../../api/friend_request';
import './FriendRequestReceived.css';
import { useDispatch } from 'react-redux';
import {
    removeReceivedRequest
} from '../../../slices/friendRequestsSlice';
import friendsAPI from '../../../api/friends';
import { addFriend } from '../../../slices/friendsSlice';
import { formatDate } from '../../../utils';
import userAPI from '../../../api/user';

const FriendRequest = ({ created_at, id, receiver_id, sender_id, status }) => {
    const [senderUsername, setSenderUsername] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSenderUsername = async () => {
            try {
                const sender = await userAPI.getUser(sender_id);
                setSenderUsername(sender.username)
            } catch (error) {
                console.error('Error fetching sender username:', error);
            }
        };

        fetchSenderUsername();
    }, [sender_id]);


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
            // Finally we add the new friend for this user to their friends slice
            console.log("Friend username: ", senderUsername)
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
            <p>Friend request received from <b>{senderUsername}</b> ({formatDate(created_at)})</p>
            <button onClick={() => handleAcceptRequest(id, 'ACCEPTED')} className='accept-friend-request-button'>
                Accept
            </button>
            <button onClick={() => handleRejectRequest(id, 'REJECTED')} className='reject-friend-request-button'>
                Reject
            </button>
        </div>
    );
};

export default FriendRequest;