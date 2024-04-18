import React, { useEffect, useState } from 'react';
import friendRequestAPI from '../../../api/friend_request';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../slices/userSlice';
import { useDispatch } from 'react-redux';
import {
    setSentRequests,
    clearSentRequests,
    setReceivedRequests,
    clearReceivedRequests,
    selectSentRequests,
    selectReceivedRequests
} from '../../../slices/friendRequestsSlice';
import FriendRequestSent from './FriendRequestSent';
import FriendRequestReceived from './FriendRequestReceived';

import './FriendRequests.css';

const FriendRequests = () => {
    const [filter, setFilter] = useState('received');
    const userId = useSelector(selectUser).id;
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFriendRequests = async () => {
            if (userId) {
                try {
                    const sentRequests = await friendRequestAPI.getFriendRequestsSent(userId);
                    dispatch(clearSentRequests());
                    dispatch(setSentRequests(sentRequests));

                    const receivedRequests = await friendRequestAPI.getFriendRequestsReceived(userId);
                    dispatch(clearReceivedRequests());
                    dispatch(setReceivedRequests(receivedRequests));
                } catch (error) {
                    console.error('Error fetching users friend requests (both sent and received):', error);
                }
            }
        };
        fetchFriendRequests();
    }, [userId]);

    const friendRequestsSent = useSelector(selectSentRequests);
    const friendRequestsReceived = useSelector(selectReceivedRequests);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    return (
        <div className='friend-requests-container'>
            <h1>Friend Requests</h1>

            <div className="request-type-dropdown">
                <label htmlFor="request-type">Request Type: </label>
                <select className="request-type-drop-down-options" id="request-type" value={filter} onChange={handleFilterChange}>
                    <option value="sent">Sent</option>
                    <option value="received">Received</option>
                </select>
            </div>

            {filter === 'sent' ? (
                <div className='friend-requests-sent-container'>
                    {friendRequestsSent.length > 0 ? (
                        friendRequestsSent.map((request) => (
                            <FriendRequestSent 
                                key={request.id} 
                                created_at={request.created_at} 
                                id={request.id} 
                                receiver_id={request.receiver_id} 
                                sender_id={request.sender_id} 
                                status={request.status} 
                            />
                        ))
                    ) : (
                        <p className='friend-requests-sent-empty-text'>No friend requests sent</p>
                    )}
                </div>
                ) : (
                <div className='friend-requests-received-container'>
                    {friendRequestsReceived.length > 0 ? (
                        friendRequestsReceived.map((request) => (
                            request.status === 'PENDING' && <FriendRequestReceived key={request.id} created_at={request.created_at} id={request.id} receiver_id={request.receiver_id} sender_id={request.sender_id} status={request.status} />
                        ))
                    ) : (
                        <p className='friend-requests-received-empty-text'>No friend requests received</p>
                    )}

                </div>
            )}
        </div>
    );
};

export default FriendRequests;