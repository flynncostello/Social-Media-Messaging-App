import axios from './index';
import { API_ENDPOINT } from './index';

const chatroomSharedSecretAPI = {
  getChatroomSharedSecret: async (chatroom_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/chatroom_shared_secret/${chatroom_id}`);
      console.log("FRONTEND API, RESPONSE FROM GET CHATROOM SHARED SECRET: ", response.data)
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },
  createChatroomSharedSecret: async (chatroom_id, encrypted_shared_secret) => {
    const chatroom_info = { chatroom_id, encrypted_shared_secret };
    try {
      const response = await axios.post(`${API_ENDPOINT}/chatroom_shared_secret`, chatroom_info);
      console.log("FRONTEND API, RESPONSE FROM CREATE CHATROOM SHARED SECRET: ", response.data)
      return response.data;
    } catch (error) {
      console.error('Error creating chatroom shared secret:', error);
      throw error;
    }
  },
  deleteChatroomSharedSecret: async (chatroom_id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/chatroom_shared_secret/${chatroom_id}`);
      console.log("FRONTEND API, RESPONSE FROM DELETE CHATROOM SHARED SECRET: ", response.data)
      return response;
    } catch (error) {
      console.error('Error deleting chatroom shared secret:', error);
      throw error;
    }
  }
};

export default chatroomSharedSecretAPI;
