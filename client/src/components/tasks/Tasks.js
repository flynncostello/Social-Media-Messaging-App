// Tasks.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksAsync, addTaskAsync, updateTaskAsync, deleteTaskAsync, getTaskByIdAsync } from './taskActions';
import { selectTasks } from './tasksSlice';

const Tasks = () => {
  const dispatch = useDispatch();
  const tasksState = useSelector(selectTasks);
  const { tasks_obj, loading } = tasksState;

  useEffect(() => {
    // Fetch tasks when the component mounts
    dispatch(fetchTasksAsync());
  }, [dispatch]);

  const handleAddTask = () => {
    // Example of adding a new task
    const newTask = {
      task_id: '2', // Replace with an actual ID from your backend
      title: 'New Task',
      description: 'This is a new task',
      created_at: '2024-02-21',
    };
    dispatch(addTaskAsync(newTask));
  };

  const handleUpdateTask = () => {
    // Example of updating an existing task
    const updatedTask = {
      task_id: '1', // Replace with an actual ID from your backend
      title: 'Updated Task',
      description: 'This task has been updated',
    };
    dispatch(updateTaskAsync(updatedTask));
  };

  const handleDeleteTask = () => {
    // Example of deleting an existing task
    const taskIdToDelete = '1'; // Replace with an actual ID from your backend
    dispatch(deleteTaskAsync(taskIdToDelete));
  };

  const handleGetTaskById = () => {
    // Example of fetching a task by ID
    const taskIdToFetch = '1'; // Replace with an actual ID from your backend
    dispatch(getTaskByIdAsync(taskIdToFetch));
  };

  return (
    <div>
      <h1>Tasks</h1>
      {loading && <p>Loading...</p>}
      <ul>
        {Object.values(tasks_obj).map((task) => (
          <li key={task.task_id}>
            <strong>{task.title}</strong>: {task.description}
          </li>
        ))}
      </ul>
      <button onClick={handleAddTask}>Add Task</button>
      <button onClick={handleUpdateTask}>Update Task</button>
      <button onClick={handleDeleteTask}>Delete Task</button>
      <button onClick={handleGetTaskById}>Get Task by ID</button>
    </div>
  );
};

export default Tasks;
