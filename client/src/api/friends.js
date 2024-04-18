import axios from './index';
import { API_ENDPOINT } from './index';

const friendsAPI = {
  getFriends: async (user_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/friends/${user_id}`);
      return response.data;
    } catch (error) {
      return [];
    }
  },
  createFriendship: async (friendship_info) => {
    // friendship_info needs to contain { userId, friendId }
    try {
      const response = await axios.post(`${API_ENDPOINT}/friends`, friendship_info);
      //console.log('FRONTEND FRIENDS API, RESPONSE RTO CREATE FRIENDSHIP: ', response.data);
      return response;
    } catch (error) {
      console.error('Error creating friendship:', error);
      throw error;
    }
  },
  deleteFriendship: async (friendship_id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/friends/${friendship_id}`);
      //console.log('FRONTEND FRIENDS API, RESPONSE TO DELETE FRIENDSHIP: ', response.data);
      return response;
    } catch (error) {
      console.error('Error deleting friendship:', error);
      throw error;
    }
  },
};

export default friendsAPI;
