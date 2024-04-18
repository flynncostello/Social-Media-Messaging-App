import axios from './index';
import { API_ENDPOINT } from './index';

const messagesAPI = {
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
