import React, { useState, useEffect } from 'react';
import './FriendRequestSent.css';
import userAPI from '../../../api/user';
import { formatDate } from '../../../utils';

const FriendRequest = ({ created_at, id, receiver_id, sender_id, status  }) => {
    const [receiverUsername, setReceiverUsername] = useState('');

    useEffect(() => {
        const fetchReceiverUsername = async () => {
            try {
                const receiver = await userAPI.getUser(receiver_id);
                setReceiverUsername(receiver.username)
            } catch (error) {
                console.error('Error fetching receiver username:', error);
            }
        };

        fetchReceiverUsername();
    }, [receiver_id]);

    return (
        <div className='friend-request-sent-container'>
            <div className='friend-request-sent-text'>Friend request sent to <b>{receiverUsername}</b> ({formatDate(created_at)}) <p className={status === 'ACCEPTED' ? 'request-sent-status-badge-accepted' : status === 'PENDING' ? 'request-sent-status-badge-pending' : 'request-sent-status-badge-rejected'}>{status}</p></div>
        </div>
    );
};

export default FriendRequest;