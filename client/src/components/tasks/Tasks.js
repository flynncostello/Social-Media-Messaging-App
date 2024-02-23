import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksAsync, deleteTaskAsync } from './taskActions';
import { selectTasks } from './tasksSlice';
import { addTaskAsync } from './taskActions';
import TaskForm from './TaskForm';
import Task from './Task';
import './Tasks.css';

const Tasks = () => {
  const dispatch = useDispatch();
  const tasksState = useSelector(selectTasks);
  const { tasks_obj, loading } = tasksState;

  useEffect(() => {
    // Fetch tasks when the component mounts
    console.log("GETTING TASKS");
    dispatch(fetchTasksAsync());
  }, [dispatch]);

  const handleDeleteTask = (task) => {
    const taskIdToDelete = task.task_id || task.local_temp_id;
    dispatch(deleteTaskAsync(taskIdToDelete));
  };

  const submitCreateTaskForm = (newTask) => {
    dispatch(addTaskAsync(newTask));
  };

  return (
    <div className='tasks-page'>
      <h1 className='tasks-heading'>Tasks</h1>
      {loading && <p>Loading...</p>}
      <div className='tasks-and-create-new-task-container'>
        <div className='tasks-list-container'>
          <ul className='tasks-list'>
            {Object.values(tasks_obj).map((task) => (
              <Task key={task.task_id || task.local_temp_id} task={task} handleDeleteTask={handleDeleteTask} />
            ))}
          </ul>
        </div>
        <div>
            <h2 className='new-task-title'>Create New Task</h2>
            <TaskForm submitFormFunction={submitCreateTaskForm} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
