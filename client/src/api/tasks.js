import axios from 'axios';
import { API_ENDPOINT } from './index';

const tasksAPI = {
  getTasks: async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/tasks`);
      return response;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  getTask: async (task_id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/tasks/${task_id}`);
      return response;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  createTask: async (task_info) => {
    try {
      const response = await axios.post(`${API_ENDPOINT}/tasks`, task_info);
      return response;
    } catch (error) {
      console.error('Error adding new task:', error);
      throw error;
    }
  },

  updateTask: async (task_id, task_info) => {
    try {
      const response = await axios.put(`${API_ENDPOINT}/tasks/${task_id}`, task_info);
      return response;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (task_id) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/tasks/${task_id}`);
      return response;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};

export default tasksAPI;
