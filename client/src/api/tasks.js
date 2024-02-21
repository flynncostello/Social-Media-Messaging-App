import axios from 'axios';
import { API_ENDPOINT } from './index';

export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const getTask = async (task_id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/tasks/${task_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

export const createTask = async (task_info) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/tasks`, task_info);
    return response.data;
  } catch (error) {
    console.error('Error adding new task:', error);
    throw error;
  }
};

export const updateTask = async (task_id, task_info) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/tasks/${task_id}`, task_info);
    return response.status;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (task_id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/tasks/${task_id}`);
    return response.status;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};





