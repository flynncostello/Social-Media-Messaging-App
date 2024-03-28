import axios from 'axios';
import { API_ENDPOINT } from './index';

const friendsAPI = {
  getFriends: async (user_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/friends/${user_id}`);
      console.log('Friends:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting friends:', error);
      throw error;
    }
  },
  createFriendship: async (friendship_info) => {
    try {
      const response = await axios.post(`${API_ENDPOINT}/friends`, friendship_info);
      console.log('Friendship created:', response.data)
      return response;
    } catch (error) {
      console.error('Error creating friendship:', error);
      throw error;
    }
  },
  deleteFriendship: async (friendship_id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/friends/${friendship_id}`);
      console.log('Friendship deleted:', response.data);
      return response;
    } catch (error) {
      console.error('Error deleting friendship:', error);
      throw error;
    }
  },
};

export default friendsAPI;
