import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './Friend.css';
import { useDispatch, useSelector } from 'react-redux';
import userAPI from '../../../api/user';
import friendsAPI from '../../../api/friends';
import chatroomsAPI from '../../../api/chatrooms';
import { removeFriend } from '../../../slices/friendsSlice';
import { selectUser } from '../../../slices/userSlice';
import { setChatroom } from '../../../slices/chatroomSlice';
import messagesAPI from '../../../api/messages';

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
      console.log(friendshipId);
      // Deleting the first friendship connection (user_id is the user who is logged in)
      dispatch(removeFriend(friendshipId));
      friendsAPI.deleteFriendship(friendshipId);

      // Deleting the second friendship connection (friend_id is the user who is logged in)
      const friends_friends = await friendsAPI.getFriends(friendId);
      const friendship = friends_friends.find(
        (friendship) => friendship.user_id === friendId && friendship.friend_id === user_id
      );
      const second_friendship_id = friendship.id;
      friendsAPI.deleteFriendship(second_friendship_id);

      // ~ NEED TO ALSO HANDLE DELETING CHATROOMS AND THEIR CHATS ~ //
    }
  };

  /* RETRIEVING CHATROOM INFO OR CREATING NEW CHATROOM AND ADDING TO LOCAL SLICE */
  // Getting messages from chatroom
  const getMessagesFromChatroom = async (chatroom_id) => {
    const messages = await messagesAPI.getMessagesByChatroomId(chatroom_id);
    return messages;
  };

  // Function looks for chatroom we are entering, if it finds it, returns chatroom id and chats within chatroom, otherwise returns null
  const fetchChatroomDataFromDatabase = async (user_id, friend_id) => {
    const usersChatrooms = await chatroomsAPI.getUsersChatrooms(user_id);
    if (usersChatrooms.length > 0) {
      for (const chatroom of usersChatrooms) {
        const cur_chatroom_id = chatroom.id;
        const cur_chatroom_friendId =
          chatroom.host_id === user_id ? chatroom.participant_id : chatroom.host_id;
        if (cur_chatroom_friendId === friend_id) {
          const messages = await getMessagesFromChatroom(cur_chatroom_id);
          const chatroom_info = {
            chatroomId: cur_chatroom_id,
            friendId: friend_id,
            messages: messages,
          };
          return chatroom_info;
        }
      }
    }
    return null; // Need to create new chatroom
  };

  // Moving to new chatroom by either accessing existing chatroom or creating new one
  const goToChatroom = async () => {
    // First we re-fetch the data for this chatroom - first looking for entry then returning data and assigning slices slot for it
    const existingChatroomInfo = await fetchChatroomDataFromDatabase(user_id, friendId);

    if (existingChatroomInfo === null) {
      // Need to create new chatroom
      const new_chatroom = await chatroomsAPI.createChatroom(user_id, friendId); // Creating chatroom in DATABASE
      const chatroom_id = new_chatroom.id;
      dispatch(
        setChatroom({
          id: chatroom_id,
          friend_id: friendId,
          messages: [],
        })
      );
    } else {
      // Chatroom exists in database
      dispatch(
        setChatroom({
          id: existingChatroomInfo.chatroomId,
          friend_id: existingChatroomInfo.friendId,
          messages: existingChatroomInfo.messages,
        })
      );
    }
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
            <FontAwesomeIcon
              icon={faTimesCircle}
              className="delete-friend-button"
              onClick={handleDeleteFriend}
            />
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Friend;