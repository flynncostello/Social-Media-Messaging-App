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

const FriendRequests = () => {
    const [filter, setFilter] = useState('sent');
    const userId = useSelector(selectUser).id;
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFriendRequests = async () => {
            if (userId) {
                try {
                    const sentRequests = await friendRequestAPI.getFriendRequestsSent(userId);
                    //console.log("SENT REQUESTS: ", sentRequests)
                    dispatch(clearSentRequests());
                    dispatch(setSentRequests(sentRequests));

                    const receivedRequests = await friendRequestAPI.getFriendRequestsReceived(userId);
                    //console.log("RECEIVED REQUESTS: ", receivedRequests)
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

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        //console.log("CUR FILTER, ", newFilter);
    };

    return (
        <div>
            <h1>Friend Requests</h1>
            <div>
                <button onClick={() => handleFilterChange('sent')}>Sent</button>
                <button onClick={() => handleFilterChange('received')}>Received</button>
            </div>
            <div>
                {filter === 'sent' ? (
                <div>
                    <h3>Requests Sent:</h3>
                    {friendRequestsSent.map((request) => (
                        <FriendRequestSent key={request.id} created_at={request.created_at} id={request.id} receiver_id={request.receiver_id} sender_id={request.sender_id} status={request.status} />
                    ))}
                </div>
                ) : (
                <div>
                    <h3>Requests Received:</h3>
                    {friendRequestsReceived.map((request) => (
                        request.status === 'PENDING' && <FriendRequestReceived key={request.id} created_at={request.created_at} id={request.id} receiver_id={request.receiver_id} sender_id={request.sender_id} status={request.status} />
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};

export default FriendRequests;