import axios from './index';
import { API_ENDPOINT } from './index';

const messagesAPI = {
  /*
  getMessagesByChatroomIdAndStorerId: async (chatroom_id, storer_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/messages/chatroom/${chatroom_id}/storedBy/${storer_id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  },
  getMessagesWaitingForRetrievalByChatroomId: async (chatroom_id, user_id) => {
    // We use user_id to check that the sender of the messages waiting for retrieval isn't user, so the user must therefore retrieve it
    try {
      const response = await axios.get(`${API_ENDPOINT}/messages/chatroom/${chatroom_id}/messagesWaitingFor/${user_id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  },
  */

  getMessagesByChatroomId: async (chatroom_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/messages/chatroom/${chatroom_id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  },
  createMessage: async (chatroom_id, chatroom_index, stored_by_id, sender_id, content) => {
    const messageInfo = {
      chatroom_id,
      chatroom_index,
      stored_by_id,
      sender_id,
      content,
    };
    try {
      const response = await axios.post(`${API_ENDPOINT}/messages`, messageInfo);
      return response.data;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  deleteMessage: async (message_id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/messages/${message_id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },
};

export default messagesAPI;
