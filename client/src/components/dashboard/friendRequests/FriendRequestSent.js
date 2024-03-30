import React from 'react';
import friendRequestAPI from '../../../api/friend_request';
import './FriendRequestSent.css';

const FriendRequest = ({ created_at, id, receiver_id, sender_id, status  }) => {
    return (
        <div className='friend-request-sent-container'>
            <p>Friend Request ID: {id}</p>
            <p>Friend request sent to {receiver_id} at {created_at}. Status: {status}</p>
        </div>
    );
};

export default FriendRequest;