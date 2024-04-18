import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../slices/userSlice';
import friendsAPI from '../../../api/friends';
import Friend from './Friend';
import { setFriends, clearFriendsSlice, selectFriends } from '../../../slices/friendsSlice';
import { useDispatch } from 'react-redux';
import './Friends.css';

const Friends = () => {
  let fetchedFriendsData = false;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!fetchedFriendsData && user.is_active) {
          fetchedFriendsData = true
          const friendsData = await friendsAPI.getFriends(user.id);

          dispatch(clearFriendsSlice());
          dispatch(setFriends(friendsData));
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
  
    fetchFriends();
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
              <Friend friendId={friendId} friendshipId={friendshipId} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Friends;

