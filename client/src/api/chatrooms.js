import axios from './index';
import { API_ENDPOINT } from './index';

const chatroomsAPI = {
  getChatroomById: async (chatroom_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/chatrooms/${chatroom_id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting chatroom:', error);
      throw error;
    }
  },
  getUsersChatrooms: async (user_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/chatrooms/user/${user_id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting users chatrooms:', error);
      throw error;
    }
  },
  createChatroom: async (host_id, participant_id) => {
    const chatroom_info = {
      host_id,
      participant_id
    }
    try {
      const response = await axios.post(`${API_ENDPOINT}/chatrooms`, chatroom_info);
      return response.data;
    } catch (error) {
      console.error('Error creating chatroom:', error);
      throw error;
    }
  },

  deleteChatroom: async (chatroom_id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/chatrooms/${chatroom_id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting chatroom:', error);
      throw error;
    }
  },
};

export default chatroomsAPI;
