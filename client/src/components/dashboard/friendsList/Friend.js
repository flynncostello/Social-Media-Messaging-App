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
import { setChatroom, resetChatroom } from '../../../slices/chatroomSlice';
import messagesAPI from '../../../api/messages';
import { decryptWithPrivateKey, encryptMessageWithUsersPassword, decryptMessageWithUsersPassword } from '../chatroom/chatroom_utils';

const Friend = ({ friendId, friendshipId, friendPublicKey }) => {
  const [friendDetails, setFriendDetails] = useState(null);
  const dispatch = useDispatch();
  const user_id = useSelector(selectUser).id;

  // Need to create a socket receive event for when public key change of friend is received

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

  useEffect(() => {
    console.log("Inside friend, updating friend details friend public key with new public key: ", friendPublicKey);
    if (friendPublicKey === null) {
      console.log("Public key hasn't changed so do nothing")
      return;
    }
    console.log("Old public key I stored was: ", friendDetails.public_key);
    console.log("Public key has been updated to update friend data in local slice");
    const newFriendData = {
      ...friendDetails,
      public_key: friendPublicKey,
    };
    console.log("New public key I store for friend is: ", friendPublicKey);
    console.log("Updated friend details: ", newFriendData);
    setFriendDetails(newFriendData);
  }, [friendPublicKey]);


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

  const deleteMessage = async (message_id) => {
    await messagesAPI.deleteMessage(message_id);
    console.log("Delete retrieval message after saving. Message with id ", message_id, " deleted.");
  }

  /* RETRIEVING CHATROOM INFO OR CREATING NEW CHATROOM AND ADDING TO LOCAL SLICE */
  const getMessagesFromChatroom = async (chatroom_id) => {
    const final_sorted_messages = [];
    const messages = await messagesAPI.getMessagesByChatroomId(chatroom_id); // All messages in chatroom
    console.log("IN FRIEND.JS: All messages in chatroom: ", messages)

    for (const message of messages) {

      if (message.stored_by_id === user_id && message.waiting_for_retrieval === false) { // Messages which are specifically stored by user and encrypted with their password key
        const decryptedMessage = await decryptMessageWithUsersPassword(message.content);
        console.log("IN FRIEND.JS: Message which is stored by user, decrypted using user's password key: ", decryptedMessage)
        const decryptedMessageObject = {
          id: message.id,
          chatroom_id: message.chatroom_id,
          chatroom_index: message.chatroom_index,
          sender_id: message.sender_id,
          content: decryptedMessage,
        };
        final_sorted_messages.push(decryptedMessageObject);
      
      } else if (message.waiting_for_retrieval === true && message.sender_id === friendId) { // Message needs to be retrieved by user and decrypted using users private key
        console.log("IN FRIEND.JS: Retrieving a message which has been waiting for retrieval\n")
        const decryptedMessage = await decryptWithPrivateKey(message.content);
        console.log("IN FRIEND.JS: Message which is waiting for retrieval, decrypted using friend's public key: ", decryptedMessage)
        const decryptedMessageObject = {
          id: message.id,
          chatroom_id: message.chatroom_id,
          chatroom_index: message.chatroom_index,
          sender_id: message.sender_id,
          content: decryptedMessage,
        };
        console.log("IN FRIEND.JS: Decrypted message object: ", decryptedMessageObject)
        // Adding message to final messages array to be added to slice
        final_sorted_messages.push(decryptedMessageObject);
        console.log("Retrieved message from database and added to final messages array\n")
        
        // Storing message in database encrypted with user's password
        console.log("Now storing message in database encrypted with user's own password key\n")
        console.log("Decrypted message in Friend.js: ", decryptedMessage)
        const message_encrypted_with_users_password = await encryptMessageWithUsersPassword(decryptedMessage);
        await messagesAPI.createMessage(message.chatroom_id, message.chatroom_index, user_id, friendId, message_encrypted_with_users_password);
        console.log("IN FRIEND.JS: Have retrieved message and saved it to database encrypted with user's password key. Message was: ", decryptedMessage);

        // Deleting message from database as it has been retrieved
        deleteMessage(message.id);
        console.log("IN FRIEND.JS: Deleted old copy of message which I needed to store. Had needed retrieval value of true so retrieved and now deleted.")
      }
    }

    console.log("IN FRIEND.JS: Final messages for user, ", final_sorted_messages);
    return final_sorted_messages;
  };

  // Function looks for chatroom we are entering, if it finds it, returns chatroom id and chats within chatroom, otherwise returns null
  const fetchChatroomDataFromDatabase = async (user_id, friend_id) => {
    const usersChatrooms = await chatroomsAPI.getUsersChatrooms(user_id);
    console.log("On Clicking friend chatrooms for user are: ", usersChatrooms);

    if (usersChatrooms.length > 0) {
      // Looping over all chatrooms which the user is within to find the chatroom we want to enter
      for (const chatroom of usersChatrooms) {
        const cur_chatroom_id = chatroom.id;
        const cur_chatroom_friendId =
          chatroom.host_id === user_id ? chatroom.participant_id : chatroom.host_id;

        if (cur_chatroom_friendId === friend_id) {
          // Found chatroom we are entering
          console.log("Chatroom we are entering is: ", cur_chatroom_id);
          const messages = await getMessagesFromChatroom(cur_chatroom_id);
          console.log("Chatroom messages: ", messages, " for chatroom id: ", cur_chatroom_id);
          const chatroom_info = {
            chatroomId: cur_chatroom_id,
            friend: {
              id: cur_chatroom_friendId,
              is_active: friendDetails.is_active,
              public_key: friendDetails.public_key,
              username: friendDetails.username,
            },
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
    const friendInfo = await userAPI.getUser(friendId);
    const friend_is_active = friendInfo.is_active;

    //console.log("FRIEND INFO: ", friendDetails);
    if (friend_is_active) {
      if (existingChatroomInfo === null) {
        // Need to create new chatroom
        console.log("Creating a new chatroom")
        const new_chatroom = await chatroomsAPI.createChatroom(user_id, friendId); // Creating chatroom in DATABASE
        const chatroom_id = new_chatroom.id;
        console.log("New room friend details are id: ", friendId, " and public key: ", friendDetails.public_key);
        dispatch(
          setChatroom({
            id: chatroom_id,
            friend: {
              id: friendId,
              is_active: friendDetails.is_active,
              public_key: friendDetails.public_key,
              username: friendDetails.username,
            },
            messages: [],
          })
        );
      } else {
        // Chatroom exists in database
        console.log("Using an existing chatroom")
        dispatch(
          setChatroom({
            id: existingChatroomInfo.chatroomId,
            friend: existingChatroomInfo.friend,
            messages: existingChatroomInfo.messages,
          })
        );
      }
    } else {
      alert("This friend is not active and cannot be messaged");
      dispatch(resetChatroom());
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