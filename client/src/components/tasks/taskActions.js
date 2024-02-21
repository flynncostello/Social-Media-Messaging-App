// taskActions.js
import {
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    setLoading,
} from './tasksSlice';
import tasksAPI from '../../api/tasks';

export const fetchTasks = () => async (dispatch) => {
    dispatch(setLoading(true));

    try {
        const response = await tasksAPI.getTasks();

        if (response.status === 200) {
            dispatch(setTasks(response.data));
        } else {
            console.error('Fetch tasks failed:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        dispatch(setLoading(false));
    }
};

export const addTaskAsync = (task_info) => async (dispatch) => {
    // Optimistic update: Add task to local state immediately
    dispatch(addTask(task_info));

    try {
        // Make API request to add task
        const response = await tasksAPI.createTask(task_info);

        if (response.status === 201) {
            // Update local state with the task returned by the server
            dispatch(updateTask(response.data));
        } else {
            console.error('Add task failed:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
};
  
export const updateTaskAsync = (task_id, task_info) => async (dispatch) => {
    // Optimistic update: Update task in local state immediately
    dispatch(updateTask(task_info));

    try {
        // Make API request to update task
        const response = await tasksAPI.updateTask(task_id, task_info);

        if (response.status !== 200) {
            console.error('Update task failed:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
};

export const deleteTaskAsync = (task_id) => async (dispatch) => {
    // Optimistic update: Delete task from local state immediately
    dispatch(deleteTask({ task_id }));

    try {
        // Make API request to delete task
        const response = await tasksAPI.deleteTask(task_id);

        if (response.status !== 200) {
            console.error('Delete task failed:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
};
