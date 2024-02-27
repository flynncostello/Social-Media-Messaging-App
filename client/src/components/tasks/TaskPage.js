import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteTaskAsync, updateTaskAsync } from './taskActions';
import { selectTasks } from './tasksSlice';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';
import './TaskPage.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const TaskPage = () => {
    const dispatch = useDispatch();
    const { task_id } = useParams();
    const tasksState = useSelector(selectTasks);
    const { tasks_obj } = tasksState;
    const navigate = useNavigate();

    // Retrieve the task using task_id
    const task = tasks_obj[task_id];

    // State for the TaskForm
    /*
    const [title, setTitle] = useState(task.title || '');
    const [description, setDescription] = useState(task.description || '');
    const [created_at, setCreatedAt] = useState(task.created_at || '2021-01-01T00:00:00.000Z');
    */

    const [editing, setEditing] = useState(false);

    /*
    useEffect(() => {
        // Set the form fields when task details change
        setTitle(task.title || '');
        setDescription(task.description || '');
        setCreatedAt(task.created_at || '2021-01-01T00:00:00.000Z');
    }, [task]);
    */

    // Handle delete button click
    const handleDelete = () => {
        dispatch(deleteTaskAsync(task_id));
        navigate('/tasks');
    };

    // Handle edit button click
    const handleEdit = () => {
        // Toggle the editing state
        setEditing(!editing);
    };

    // Handle save button click
    const handleSave = (newTask) => {
        // newTask is an object with properties title, description, local_temp_id
        // Update the task with new title and description
        const updatedTaskInfo = { ...task, title: newTask.title, description: newTask.description };
        dispatch(updateTaskAsync(task_id, updatedTaskInfo));
        // After saving, toggle the editing state back to false
        setEditing(false);
    };

    return (
        <div className="task-page-container">
            <button className="back-button" onClick={() => navigate('/tasks')}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            {task ? (
                <div className="task-details-container">
                    <h2>Title: {task.title}</h2>
                    <p>Description: {task.description}</p>
                    <p>Date Created: {task.created_at}</p>

                    <div className='task-page-buttons'>   
                        {/* Delete button */}
                        <button className="delete-button" onClick={handleDelete}>Delete Task</button>

                        {/* Edit button */}
                        <button className="edit-button" onClick={handleEdit}>Edit Task</button>
                    </div>
                </div>
            ) : (
                <p>Task not found</p>
            )}

            {editing ? (
                // Render TaskForm when editing is true
                <TaskForm submitFormFunction={handleSave} />
            ) : null}
        </div>
    );
};

export default TaskPage;
