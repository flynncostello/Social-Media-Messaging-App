import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../slices/userSlice';

import friendsAPI from '../../../api/friends';
import Friend from './Friend';

import { setFriends, clearFriendsSlice, selectFriends } from '../../../slices/friendsSlice';
import { useDispatch } from 'react-redux';

import './Friends.css';

import io from 'socket.io-client';
import { socket } from '../../login/Login';

const Friends = () => {
  const [friendIdBeingUpdate, setFriendIdBeingUpdayed] = useState(null);
  const [newFriendPublicKey, setNewFriendPublicKey] = useState(null);

  let fetchedFriendsData = false;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!fetchedFriendsData && user.is_active) {
          fetchedFriendsData = true
          const friendsData = await friendsAPI.getFriends(user.id);
          /*
          friendsData = [
            {
              id: "243tgdhfdfg"
              user_id: "z2f234g3erdg"
              friend_id: "a3sgt4w32r"
            }
          ]
          */
          dispatch(clearFriendsSlice());
          dispatch(setFriends(friendsData));
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
  
    fetchFriends();

    // Listen for 'updatePublicKey' event from the server
    const updatePublicKeyHandler = ({ userId, publicKey }) => {
      const cur_friend_id = userId
      console.log("I have to update the public key of my friend with id, ", userId, ", with new public key: ", publicKey);
      setFriendIdBeingUpdayed(cur_friend_id);
      setNewFriendPublicKey(publicKey);
    };

    socket.on('updatePublicKey', updatePublicKeyHandler);
    console.log("Mounted socket event listener for updatePublicKey");
  }, [user.id]);

  const friendships = useSelector(selectFriends); // Makes it so that if friends slice changes then this componenet authomatically re-renders

  return (
    <div className='friends-column'>
      {Object.keys(friendships).length === 0 ? (
        <p className='no-friends-added-text'>Add New Friends</p>
      ) : (
        <ul className='friends-list'>
          {Object.entries(friendships).map(([friendshipId, friendId]) => (
            <li key={friendshipId}>
              <Friend friendId={friendId} friendshipId={friendshipId} friendPublicKey={newFriendPublicKey} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Friends;