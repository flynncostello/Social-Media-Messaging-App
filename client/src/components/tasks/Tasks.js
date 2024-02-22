import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksAsync, addTaskAsync, deleteTaskAsync } from './taskActions';
import { selectTasks } from './tasksSlice';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function generateTemporaryId() {
  return `local_${uuidv4()}`;
}

const Tasks = () => {
  const dispatch = useDispatch();
  const tasksState = useSelector(selectTasks);
  const { tasks_obj, loading } = tasksState;

  useEffect(() => {
    // Fetch tasks when the component mounts
    console.log("GETTING TASKS");
    dispatch(fetchTasksAsync());
  }, [dispatch]);

  const handleAddTask = (title, description) => {
    const newTask = {
      title,
      description,
      local_temp_id: generateTemporaryId(),
    };
    dispatch(addTaskAsync(newTask));
    //console.log("STATE AFTER ADD, ", tasksState.tasks_obj)
  };

  const handleDeleteTask = (task) => {
    const taskIdToDelete = task.task_id || task.local_temp_id;
    console.log("ID TO DELETE ", taskIdToDelete);
    dispatch(deleteTaskAsync(taskIdToDelete));
    console.log("STATE AFTER DELETE, ", tasksState.tasks_obj)
  };

  // State for the new task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleTitleChange = (e) => {
    setNewTaskTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setNewTaskDescription(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Call the function to handle task creation with the provided title and description
    handleAddTask(newTaskTitle, newTaskDescription);
    // Clear the form fields after submission
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  return (
    <div>
      <h1>Tasks</h1>
      {loading && <p>Loading...</p>}
      <ul>
        {Object.values(tasks_obj).map((task) => (
            <li key={task.task_id || task.local_temp_id}>
                <strong>{task.title}</strong>: {task.description}
                <button className="delete-button" onClick={() => handleDeleteTask(task)}>
                    <FontAwesomeIcon icon={faTimes} /> {/* Use FontAwesome "times" (X) icon */}
                </button>
            </li>
        ))}
      </ul>
      <h2>Create New Task</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="newTaskTitle">Title:</label>
        <input
          type="text"
          id="newTaskTitle"
          value={newTaskTitle}
          onChange={handleTitleChange}
          required
        />
        <br />
        <label htmlFor="newTaskDescription">Description:</label>
        <input
          type="text"
          id="newTaskDescription"
          value={newTaskDescription}
          onChange={handleDescriptionChange}
          required
        />
        <br />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default Tasks;
