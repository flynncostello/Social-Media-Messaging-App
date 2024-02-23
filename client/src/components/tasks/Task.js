// Task.js

import React, { useState } from 'react';
/*
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
*/
import './Task.css';
import ROUTES from '../../routes';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateTaskAsync } from './taskActions';

const Task = ({ task, handleDeleteTask }) => {
    const { title, description, completed } = task;
    //const [completed, setCompleted] = useState(false);

    const dispatch = useDispatch();

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        //setCompleted(!completed);
        const updatedTask = { ...task, completed: !completed };
        dispatch(updateTaskAsync(task.task_id, updatedTask));
    };

    const handleDeleteButtonClick = (e) => {
        e.preventDefault();
        handleDeleteTask(task);
    };

    return (
        <li key={task.task_id || task.local_temp_id} className='task-list-element'>
            <Link to={ROUTES.taskRoute(task.task_id)}>
                <div className='task-div'>
                    {/* Check box */}
                    <div className="checkbox-wrapper-12">
                        <div className="cbx">
                            <input type="checkbox" id="cbx-12" checked={completed} onClick={handleCheckboxChange} onChange={() => {}} />
                            <label htmlFor="cbx-12"></label>
                            <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                            <path d="M2 8.36364L6.23077 12L13 2"></path>
                            </svg>
                        </div>
                        
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                            <filter id="goo-12">
                                <feGaussianBlur result="blur" stdDeviation="4" in="SourceGraphic"></feGaussianBlur>
                                <feColorMatrix result="goo-12" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" mode="matrix" in="blur"></feColorMatrix>
                                <feBlend in2="goo-12" in="SourceGraphic"></feBlend>
                            </filter>
                            </defs>
                        </svg>
                    </div>

                    {/* Task information */}
                    <div className='task-info'>
                    <h2>{title}</h2>
                    <h3>{description}</h3>
                    </div>

                    {/* Delete button */}
                    <button className="deleteButton" onClick={handleDeleteButtonClick}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 50 59"
                            className="bin"
                        >
                            <path
                            fill="#B5BAC1"
                            d="M0 7.5C0 5.01472 2.01472 3 4.5 3H45.5C47.9853 3 50 5.01472 50 7.5V7.5C50 8.32843 49.3284 9 48.5 9H1.5C0.671571 9 0 8.32843 0 7.5V7.5Z"
                            ></path>
                            <path
                            fill="#B5BAC1"
                            d="M17 3C17 1.34315 18.3431 0 20 0H29.3125C30.9694 0 32.3125 1.34315 32.3125 3V3H17V3Z"
                            ></path>
                            <path
                            fill="#B5BAC1"
                            d="M2.18565 18.0974C2.08466 15.821 3.903 13.9202 6.18172 13.9202H43.8189C46.0976 13.9202 47.916 15.821 47.815 18.0975L46.1699 55.1775C46.0751 57.3155 44.314 59.0002 42.1739 59.0002H7.8268C5.68661 59.0002 3.92559 57.3155 3.83073 55.1775L2.18565 18.0974ZM18.0003 49.5402C16.6196 49.5402 15.5003 48.4209 15.5003 47.0402V24.9602C15.5003 23.5795 16.6196 22.4602 18.0003 22.4602C19.381 22.4602 20.5003 23.5795 20.5003 24.9602V47.0402C20.5003 48.4209 19.381 49.5402 18.0003 49.5402ZM29.5003 47.0402C29.5003 48.4209 30.6196 49.5402 32.0003 49.5402C33.381 49.5402 34.5003 48.4209 34.5003 47.0402V24.9602C34.5003 23.5795 33.381 22.4602 32.0003 22.4602C30.6196 22.4602 29.5003 23.5795 29.5003 24.9602V47.0402Z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                            ></path>
                            <path fill="#B5BAC1" d="M2 13H48L47.6742 21.28H2.32031L2 13Z"></path>
                        </svg>

                    </button>



                </div>
            </Link>
        </li>
    );
};

export default Task;

/*
<input
          type="checkbox"
          checked={completed}
          onChange={handleCheckboxChange}
        />
*/