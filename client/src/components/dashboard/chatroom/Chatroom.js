import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../../slices/userSlice";
import { selectChatroom, updateFriendPublicKey, addMessage, resetChatroom } from '../../../slices/chatroomSlice';

import chatroomsAPI from '../../../api/chatrooms';
import messagesAPI from '../../../api/messages';
import { decryptWithPrivateKey, encryptWithReceiversPublicKey, encryptMessageWithUsersPassword } from './chatroom_utils';
import './Chatroom.css';

import io from 'socket.io-client';
import { socket } from '../../../components/login/Login';

const Chatroom = () => {
  const [message, setMessage] = useState('');
  const [lockingChatroom, setLockingChatroom] = useState(false);

  const user_id = useSelector(selectUser).id;

  const chatroom_id = useSelector(selectChatroom).id || null;
  const chatroom_friend = useSelector(selectChatroom).friend || {};
  const chatroom_messages = useSelector(selectChatroom).messages || [];

  const dispatch = useDispatch();


  // Handles sending message to database
  const sendMessageToDatabase = async (chatroom_id, message, stored_by_id, sender_id, chatroom_index) => {
    try {
      console.log(`All info being sent to database for message:
      Chatroom ID: ${chatroom_id}
      Message: ${message}
      Stored By ID: ${stored_by_id}
      Sender ID: ${sender_id}
      Chatroom Index: ${chatroom_index}`);
      const created_message = await messagesAPI.createMessage(chatroom_id, chatroom_index, stored_by_id, sender_id, message);
      console.log("Message saved to database");
    } catch (error) {
      console.error("Error saving message to database:", error);
    }
  }

  // SETTING UP CONNECTION TO CHATROOM //
  useEffect(() => {
    if (chatroom_id !== null) {
      console.log("MOVING TO NEW CHATROOM")
      // Join the chat room socket
      socket.emit('join-room', chatroom_id);

      // Listen for incoming messages
      socket.on('receive-message', (data) => {
        const handleReceivedMessage = async () => {
          const { encrypted_message, senderId, chatroom_index } = data; // Message is string text i.e., content
          // Decrypting message using private key
          //console.log("Information received from socket, encrypted message: ", encrypted_message, "senderId: ", senderId, "chatroom_index: ", chatroom_index);
          const decryptedMessage = await decryptWithPrivateKey(encrypted_message);
          console.log("Decrypted message on receivers end: ", decryptedMessage)
          
          // Update the Redux store with the received message
          console.log(`Received message ${decryptedMessage} from sender ${senderId} in chatroom ${chatroom_id} at index ${chatroom_index}`)
          dispatch(addMessage({ chatroom_id: chatroom_id,  chatroom_index, sender_id: senderId, content: decryptedMessage }));
          
          // Storing message in database encrypted with user's password
          const message_encrypted_with_users_password = await encryptMessageWithUsersPassword(decryptedMessage);
          //console.log("Message encrypted with user's password: ", message_encrypted_with_users_password)
          console.log("Message index of received message being added to users personal messages: ", chatroom_index)

          // Sender id for received message is user as we just want one entire set of messages received or sent for each user
          sendMessageToDatabase(chatroom_id, message_encrypted_with_users_password, user_id, chatroom_friend.id, chatroom_index); // Posting message to database
        };

        handleReceivedMessage();
      });

      // Listen for 'updatePublicKey' event from the server
      const updatePublicKeyHandler = ({ userId, publicKey }) => {
        const cur_friend_id = userId
        console.log("I am within the chatroom (i.e., chatroom is being held open) and need to update user ", userId, ", public key with with new public key: ", publicKey);
        dispatch(updateFriendPublicKey(publicKey));
        console.log("Check redux, I have updated the user's friends public key for this chatroom")
      };
      socket.on('updatePublicKey', updatePublicKeyHandler);
      console.log("Mounted socket event listener for updatePublicKey ON CHATROOM");

      // Adding event listener for restricting chatrooms when other users are offline
      const closeChatroomHandler = ({ userId }) => {
        console.log("Closing chatroom as other user is offline")
        alert('Closing chatroom as friend is offline.')
        setLockingChatroom(true);
        dispatch(resetChatroom());
      }
      socket.on('closeChatroom', closeChatroomHandler);
      console.log("Mounted socket event listener for closeChatroom ON CHATROOM")
    }


    // Clean up event listeners when the component unmounts or when the chatroom changes
    return () => {
      socket.off('receive-message');
      socket.emit('leave-room', chatroom_id);
    };

  }, [chatroom_id]);


  // SUBMITTING A MESSAGE //
  const handleSubmitMessage = async (event) => {
    if (message.trim() === '') {
      alert('Please enter a message');
      return;
    };

    event.preventDefault();
    console.log("Sending message now...")

    const message_index = chatroom_messages.length
    console.log("New message index: ", message_index)

    // ADDING MESSAGE PLAINTEXT TO SLICE //
    dispatch(addMessage({ chatroom_id: chatroom_id,  chatroom_index: message_index, sender_id: user_id, content: message }));
    console.log("Message added to local slice")

    // SENDING MESSAGE ENCRYPTED WITH RECEIVER'S PUBLIC KEY TO RECEIVER //
    const message_encrypted_with_receivers_public_key = await encryptWithReceiversPublicKey(message, chatroom_friend.public_key);
    console.log("Encrypting message being sent with receiver's public key: ", chatroom_friend.public_key)
    //console.log("Encrypted message with receiver's public key: ", message_encrypted_with_receivers_public_key);
    socket.emit('send-message', { roomId: chatroom_id, encrypted_message: message_encrypted_with_receivers_public_key, senderId: user_id, chatroom_index: message_index });
    console.log("Sent message over socket to friend");

    // STORING MESSAGE ENCRYPTED WITH USER'S PASSWORD IN DATABASE //
    console.log("Adding entry in database for message encrypted with user's password as personal entry to retrieve when opening chatroom later")
    const message_encrypted_with_users_password = await encryptMessageWithUsersPassword(message);
    //console.log("Message encrypted with user's password: ", message_encrypted_with_users_password)
    sendMessageToDatabase(chatroom_id, message_encrypted_with_users_password, user_id, user_id, message_index); // Posting message to database
    console.log("Message being sent by user has also been encrypted with user's saved to database")
  
    setMessage('');
  };

    // LEAVING CHAT //
    const handleLeaveChat = () => {
      dispatch(resetChatroom());
    }
  

  return (
    chatroom_id !== null ? (
      <div className='chatroom-container'>
          {/* Chatroom */}
          <button onClick={handleLeaveChat}>Leave Chat</button>
          <p>Entering Chatroom with id: {chatroom_id} and friendId: {chatroom_friend.id}</p>
          <div className='chats-container'>
            {chatroom_messages.length > 0 && [...chatroom_messages].sort((a, b) => a.chatroom_index - b.chatroom_index)
              .map((obj, index) => (
                <div key={index} className='chat-bubble'>
                  <p className={obj.sender_id === user_id ? 'user-message' : 'friend-message'}>{obj.content}</p>
                </div>
            ))}
          </div>
          <form className='input-chat-form' onSubmit={handleSubmitMessage}>
            <input
              type='text'
              placeholder='Type a message...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type='submit'>Send</button>
          </form>
      </div>
    ) : (
      <div className='empty-chatroom-container'>
          <FontAwesomeIcon icon={faComments} className='empty-chatroom-icon' />
          <p className='empty-chatroom-instruction-text'>Click on a friend to start a chat</p>
      </div>
    )
  );
}

export default Chatroom;