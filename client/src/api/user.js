import axios from './index';
import { API_ENDPOINT } from './index';

const userAPI = {
  getUser: async (user_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/users/${user_id}`);
      //console.log("FRONTEND API, RESPONSE FROM GET USER: ", response.data)
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },
  getUsersByUsername: async (username) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/users?username=${username}`);
      //console.log("FRONTEND API, RESPONSE FROM GET USERS BY USERNAME: ", response.data)
      return response.data;
    } catch (error) {
      console.error('Error getting users by username:', error);
      throw error;
    }
  },
  updateUser: async (user_id, user_info) => {
    const updatedUserInfo = {...user_info, socket_id: user_info.socket_id};
    console.log("IN API USER INFO: ", updatedUserInfo)
    try {
      const response = await axios.put(`${API_ENDPOINT}/users/${user_id}`, updatedUserInfo);
      //console.log("FRONTEND API, RESPONSE FROM UPDATE USER: ", response.data)
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (user_id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/users/${user_id}`);
      //console.log("FRONTEND API, RESPONSE FROM DELETE USER: ", response.data)
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  searchUsers: async (searchTerm, user_id, friends_ids) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/users/search?username=${searchTerm}`);  
      const filteredUsers = response.data.filter(user => 
        user.id !== user_id && !friends_ids.includes(user.id)
      );
  
      return filteredUsers.slice(0, 10);
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
};

export default userAPI;
