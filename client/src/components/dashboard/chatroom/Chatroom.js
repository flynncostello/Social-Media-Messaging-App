import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../../slices/userSlice";
import { selectChatroom, addMessage, resetChatroom } from '../../../slices/chatroomSlice';

import chatroomsAPI from '../../../api/chatrooms';
import messagesAPI from '../../../api/messages';
import './Chatroom.css';

import io from 'socket.io-client';
const socket = io('http://localhost:3000');

const Chatroom = () => {
  const [message, setMessage] = useState('');

  const user_id = useSelector(selectUser).id;

  const chatroom_id = useSelector(selectChatroom).id || null;
  const chatroom_friend_id = useSelector(selectChatroom).friend_id || null;
  const chatroom_messages = useSelector(selectChatroom).messages || [];

  const dispatch = useDispatch();

  // SETTING UP CONNECTION TO CHATROOM //
  useEffect(() => {
    if (chatroom_id !== null) {
      // Join the chat room socket
      socket.emit('join-room', chatroom_id);

      // Listen for incoming messages
      socket.on('receive-message', (data) => {
        const { message, senderId, chatroom_index } = data; // Message is string text i.e., content
        // Update the Redux store with the received message
        console.log(`Received message ${message} from sender ${senderId} in chatroom ${chatroom_id} at index ${chatroom_index}`)
        dispatch(addMessage({ chatroom_id: chatroom_id,  chatroom_index, sender_id: senderId, content: message }));
      });
    }
    // Clean up event listeners when the component unmounts or when the chatroom changes
    return () => {
      socket.off('receive-message');
      socket.emit('leave-room', chatroom_id);
    };

  }, [chatroom_id]);

  // Handles sending message to database
  const sendMessageToDatabase = async (chatroom_id, message, sender_id, chatroom_index) => {
    try {
      const created_message = await messagesAPI.createMessage({ chatroom_id, chatroom_index, sender_id, content: message });
      console.log("Message saved to database");
    } catch (error) {
      console.error("Error saving message to database:", error);
    }
  }

  // SUBMITTING A MESSAGE //
  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const isFriendOnline = true;
    const message_index = chatroom_messages.length

    if (isFriendOnline) {
      // First adding message to users local chatroom slice
      dispatch(addMessage({ chatroom_id: chatroom_id,  chatroom_index: message_index, sender_id: user_id, content: message }));

      // Send the message through the socket
      socket.emit('send-message', { roomId: chatroom_id, message, senderId: user_id, chatroom_index: message_index });

      // Clear the message input
      setMessage('');
    } else {
      alert('Friend is not online');
      // Just post new message to database for later retrieval
      // When one of the users goes offline dont need to post entire chatroom again (as we've been posting chats as we go), just clear slice ready for next chatroom to be accessed
      sendMessageToDatabase(chatroom_id, message, user_id, message_index); // Posting message to database
    }
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
          <p>Entering Chatroom with id: {chatroom_id} and friendId: {chatroom_friend_id}</p>
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