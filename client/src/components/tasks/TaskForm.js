import React, { useState } from 'react';
//import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

function generateTemporaryId() {
  return `local_${uuidv4()}`;
}

const TaskForm = ({ submitFormFunction }) => {
  //const dispatch = useDispatch();

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
    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      local_temp_id: generateTemporaryId(),
    };

    submitFormFunction(newTask); // This function is passed as a prop from the parent component, allows for different impacts of form submission

    // Clear the form fields after submission
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  return (
    <div className="create-new-task-container">
      <div className="form-container">
        <form onSubmit={handleFormSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              required
              name="title"
              id="newTaskTitle"
              type="text"
              value={newTaskTitle}
              onChange={handleTitleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              required
              cols="50"
              rows="10"
              id="textarea"
              name="textarea"
              type="text"
              value={newTaskDescription}
              onChange={handleDescriptionChange}
            />
          </div>
          <button type="submit" className="form-submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
