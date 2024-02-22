// taskActions.js
import {
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    setLoading,
} from './tasksSlice';
import tasksAPI from '../../api/tasks';

/*
Role of these functions are to effeciently make changes to both local and external state in database
*/

// Spits out an object with task_id as key and task object as value
function createObjectFromArray(array, key) {
    return array.reduce((accumulator, currentObject) => {
        accumulator[currentObject[key]] = currentObject;
        return accumulator;
    }, {});
}

export const fetchTasksAsync = () => async (dispatch) => {
    dispatch(setLoading(true));

    try {
        // Response includes .data ([{...}, {...}, ...]) and .status (200, 404, etc.
        const response = await tasksAPI.getTasks();
        if (response.status === 200) {
            const tasks_obj = createObjectFromArray(response.data, 'task_id');
            dispatch(setTasks(tasks_obj)); // Altering state of tasks in slice
        } else {
            console.error('Fetch tasks failed', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        dispatch(setLoading(false));
    }
};

export const addTaskAsync = (task_info) => async (dispatch) => {
    // Optimistic update: Add task to local state immediately
    //console.log('Task added to local state:', task_info)
    dispatch(addTask(task_info)); // Adding task to slice


    try {
        // Make API request to add task
        const response = await tasksAPI.createTask(task_info); // Adding task to database

        if (response.status === 201) {
            // Update local state with the task returned by the server
            //console.log('Task added to database:', response.data)
            dispatch(updateTask(response.data)); // Updating newly created task in slice with state of newly created task in database
        } else {
            // Might need to add some refactoring code that removes previous local change if external push to database doesnt work !!!
            console.error('Add task to database failed:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
};
  
export const updateTaskAsync = (task_id, task_info) => async (dispatch) => {
    // Optimistic update: Update task in local state immediately
    dispatch(updateTask(task_info)); // Update locally

    try {
        // Make API request to update task
        const response = await tasksAPI.updateTask(task_id, task_info); // Attempt to make same update to external database

        if (response.status !== 200) {
            // Might need to add some refactoring code that removes previous local change if external push to database doesnt work !!!
            console.error('Update task in database failed:', response.statusText);
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
            // Might need to add some refactoring code that removes previous local change if external push to database doesnt work !!!
            console.error('Delete task in database failed:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
};
