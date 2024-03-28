import axios from 'axios';
import { API_ENDPOINT } from './index';

const userAPI = {
  getUser: async (user_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/users/${user_id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  updateUser: async (user_id, user_info) => {
    try {
      const response = await axios.put(`${API_ENDPOINT}/users/${user_id}`, user_info);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (user_id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/users/${user_id}`);
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

export default userAPI;
