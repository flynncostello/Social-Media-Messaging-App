import axios from 'axios';
import { API_ENDPOINT } from './index';

const userAPI = {
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
