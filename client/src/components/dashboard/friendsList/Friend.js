import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import userAPI from '../../../api/user';
import friendsAPI from '../../../api/friends';
import './Friend.css';
import { removeFriend } from '../../../slices/friendsSlice';
import { useDispatch } from 'react-redux';
import { selectUser } from '../../../slices/userSlice';
import { useSelector } from 'react-redux';


const Friend = ({ friendId, friendshipId }) => {
  const [friendDetails, setFriendDetails] = useState(null);
  const dispatch = useDispatch();
  const user_id = useSelector(selectUser).id;

  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const friendData = await userAPI.getUser(friendId);
        setFriendDetails(friendData);
      } catch (error) {
        console.error('Error fetching friend details:', error);
      }
    };
    fetchFriendDetails();
  }, [friendId]);

  const handleDeleteFriend = async (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${friendDetails.username} from your friends list?`
    );
    if (confirmDelete) {
      //console.log(friendDetails);
      console.log(friendshipId)
      // Deleting the first friendship connection (user_id is the user who is logged in)
      dispatch(removeFriend(friendshipId));
      friendsAPI.deleteFriendship(friendshipId)

      // Deleting the second friendship connection (friend_id is the user who is logged in)
      const friends_friends = await friendsAPI.getFriends(friendId);
      console.log("FRIENDS FRIENDS, ", friends_friends);
      const friendship = friends_friends.find(friendship => 
        friendship.user_id === friendId && friendship.friend_id === user_id
      );
      console.log("2ND FRIENDSHIP WHICH NEEDS TO BE REMOVED, ", friendship);
      const second_friendship_id = friendship.id;
      friendsAPI.deleteFriendship(second_friendship_id);
    }
  };

  const goToChatroom = () => {
    console.log('Going to chatroom with friend:', friendDetails.username);
  };

  return (
    <div className="friends-badge" onClick={goToChatroom}>
      {friendDetails ? (
        <>
          <div>
            <FontAwesomeIcon icon={faUser} className="friends-icon" />
          </div>
          <div className="friends-info">
            <div className="username">{friendDetails.username}</div>
            <FontAwesomeIcon icon={faTimesCircle} className='delete-friend-button' onClick={handleDeleteFriend} />
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Friend;