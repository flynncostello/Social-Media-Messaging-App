import axios from './index';
import { API_ENDPOINT } from './index';

const friend_requestAPI = {
  sendFriendRequest: async (user_id, friend_id) => {
    try {
      const request_info = {
        sender_id: user_id,
        receiver_id: friend_id
      }
      const response = await axios.post(`${API_ENDPOINT}/friend_requests`, request_info);
      //console.log("FRONTEND API, RESPONSE FROM SEND FRIEND REQUEST: ", response.data)
      return response.data;
    } catch (error) {
      return [];
    }
  },
  getFriendRequestsSent: async (user_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/friend_requests/sent/${user_id}`);
      //console.log("FRONTEND API, RESPONSE FROM GET FRIEND REQUESTS SENT: ", response.data)
      return response.data;
    } catch (error) {
      return [];
    }
  },
  getFriendRequestsReceived: async (user_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/friend_requests/received/${user_id}`);
      //console.log("FRONTEND API, RESPONSE FROM GET FRIEND REQUESTS RECEIVED: ", response.data)
      return response.data;
    } catch (error) {
      return [];
    }
  },
  changeFriendRequestStatus: async (request_id, status) => {
    try {
      const response = await axios.put(`${API_ENDPOINT}/friend_requests/received/${request_id}`, { status });
      //console.log("FRONTEND API, RESPONSE FROM CHANGE FRIEND REQUEST STATUS: ", response.data)
      return response.data;
    } catch (error) {
      console.error('Error changing friend request status:', error);
      throw error;
    }
  },
  deleteFriendRequest: async (request_id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/friend_requests/${request_id}`);
      //console.log("FRONTEND API, RESPONSE FROM DELETE FRIEND REQUEST: ", response.data)
      return response.data;
    } catch (error) {
      console.error('Error deleting friend request:', error);
      throw error;
    }
  }
};

export default friend_requestAPI;
