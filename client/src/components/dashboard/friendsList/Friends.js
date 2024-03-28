import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../slices/userSlice';
import { selectFriends } from '../../../slices/friendsSlice';
import friendsAPI from '../../../api/friends';
import Friend from './Friend';
import { setFriends } from '../../../slices/friendsSlice';

const Friends = () => {
  const [friendships, setFriendships] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await friendsAPI.getFriends(user.id);
        setFriendships(friendsData);
        setFriends(friendsData);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();

  }, [user.id]);

  return (
    <div>
      <h2>Friends</h2>
      {friendships.length === 0 ? (
        <p>No Friends Added Yet!</p>
      ) : (
        <ul>
          {friendships.map((friendship) => (
            <li key={friendship.id}>
              <Friend friendId={friendship.friend_id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Friends;