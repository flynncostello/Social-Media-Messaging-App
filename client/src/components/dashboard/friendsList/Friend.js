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
import { encryptWithReceiversPublicKey, decryptMessageWithSharedKey, decryptWithPrivateKey, encryptMessageWithUsersPassword, decryptMessageWithUsersPassword, validateHmac } from '../chatroom/chatroom_utils';
import chatroomSharedSecretAPI from '../../../api/chatroomSharedSecret';

const Friend = ({ friendId, friendshipId }) => {
  const [friendDetails, setFriendDetails] = useState(null);
  const dispatch = useDispatch();
  const user_id = useSelector(selectUser).id;

  // HANDLES RETRIEVING FRIENDS DETAILS FROM DATABASE //
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


  // HANDLES DELETING FRIEND //
  const handleDeleteFriend = async (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${friendDetails.username} from your friends list?`
    );
    if (confirmDelete) {
      console.log(friendshipId);
      // Deleting the first friendship connection (user_id is the user who is logged in)
      dispatch(removeFriend(friendshipId));
      await friendsAPI.deleteFriendship(friendshipId);
      console.log("Deleted friendship with id: ", friendshipId)

      // Deleting the second friendship connection (friend_id is the user who is logged in)
      const friends_friends = await friendsAPI.getFriends(friendId);
      console.log("My friends friends are: ", friends_friends)
      const friendship = friends_friends.find(
        (friendship) => friendship.user_id === friendId && friendship.friend_id === user_id
      );
      console.log("Other friendship to delete: ", friendship)
      // We are first one to delete friend
      if (friendship) {
        const second_friendship_id = friendship.id;
        await friendsAPI.deleteFriendship(second_friendship_id);
        console.log("Deleted friendship with id: ", second_friendship_id)
      }
    }
  };


  // USED FOR DELETING TEMPORARY MESSAGES AFTER ITS BEEN RETRIEVED //
  const deleteMessage = async (message_id) => {
    await messagesAPI.deleteMessage(message_id);
    console.log("Delete retrieval message after saving. Message with id ", message_id, " deleted.");
  }


  /////////////////////////////////////
  /// GETTING ALL CHATROOM MESSAGES ///
  ////////////////////////////////////
  const getMessagesFromChatroom = async (chatroom_id) => {
    const final_sorted_messages = [];
    const messages = await messagesAPI.getMessagesByChatroomId(chatroom_id); // All messages in chatroom
    console.log("IN FRIEND.JS: All messages in chatroom: ", messages)

    for (const message of messages) {

      if (message.stored_by_id === user_id && message.waiting_for_retrieval === false) { // Messages which are specifically stored by user and encrypted with their password key
        const decryptedMessage = await decryptMessageWithUsersPassword(message.content, user_id);
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
        // First check hmac is valid before decrypting message
        const hmac_is_valid = validateHmac(message.content, message.hmac, chatroom_id);
        if (!hmac_is_valid) {
          console.error("HMAC is not valid, message has been tampered with");
          return;
        }

        // Now decrypt message with shared secret key
        const decryptedMessage = await decryptMessageWithSharedKey(chatroom_id, message.content)
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
        const message_encrypted_with_users_password = await encryptMessageWithUsersPassword(decryptedMessage, user_id);
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


  /////////////////////////////////
  /// GETTING REQUIRED CHATROOM ///
  /////////////////////////////////
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

          ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //* CHECKING IF ALREADY HAS SHARED SECRET, IF NOT RETRIEVE FROM DATABASE, STORE IN LOCAL STORAGE, THEN DELETE ENTRY IN DATABASE *//
          ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          if (localStorage.getItem(`${cur_chatroom_id}_shared_secret`) === null) {
            // The key does not exist in localStorage
            const shared_secret_data = await chatroomSharedSecretAPI.getChatroomSharedSecret(cur_chatroom_id);
            console.log("GOT SHARED SECRET FOR THIS CHATROOM AS I HAVEN'T BEEN IN HERE YET");
            // Decrypting shared secret with user's private key
            const decrypted_shared_secret = await decryptWithPrivateKey(shared_secret_data.encrypted_shared_secret, user_id);
            // Store shared secret in local storage
            localStorage.setItem(`${cur_chatroom_id}_shared_secret`, decrypted_shared_secret);
            // Finally delete shared secret from database
            await chatroomSharedSecretAPI.deleteChatroomSharedSecret(cur_chatroom_id);
          }

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

  /////////////////////////////
  /// GOING TO NEW CHATROOM ///
  /////////////////////////////

  const goToChatroom = async () => {
    // First we re-fetch the data for this chatroom - first looking for entry then returning data and assigning slices slot for it
    const existingChatroomInfo = await fetchChatroomDataFromDatabase(user_id, friendId);
    if (existingChatroomInfo === null) {
      // Need to create new chatroom
      console.log("Creating a new chatroom")
      const new_chatroom = await chatroomsAPI.createChatroom(user_id, friendId); // Creating chatroom in DATABASE
      const chatroom_id = new_chatroom.id;
      console.log("New room friend details are id: ", friendId, " and public key: ", friendDetails.public_key);
      dispatch(
        setChatroom({
          id: chatroom_id,
          friend: friendDetails,
          messages: [],
        })
      );
      
      ////////////////////////////////
      //* GENERATING SHARED SECRET *//
      ////////////////////////////////
      // Finally need to 1) create shared secret, 2) store in localStorage, 3) encrypt using friend's public key and 4) send to database //
      
      // Generate a 32-byte random shared secret
      let array = new Uint8Array(32);
      window.crypto.getRandomValues(array);

      // Convert the byte array to a hexadecimal string
      let shared_secret = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join(''); // 1
      
      localStorage.setItem(`${chatroom_id}_shared_secret`, shared_secret); // 2

      const encrypted_shared_secret = await encryptWithReceiversPublicKey(shared_secret, friendDetails.public_key); // 3

      await chatroomSharedSecretAPI.createChatroomSharedSecret(chatroom_id, encrypted_shared_secret); // 4
      ////////////////////////////////


    } else {
      // Chatroom exists in database
      console.log("Using an existing chatroom")
      dispatch(
        setChatroom({
          id: existingChatroomInfo.chatroomId,
          friend: friendDetails, 
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