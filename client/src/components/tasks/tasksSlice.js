// tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks_obj: {},
    loading: false,
  },
  reducers: {
    setTasks: (state, action) => {
      // Run whenever we are retrieving all tasks from database and storing them in local state
      const new_tasks_obj = action.payload;
      state.tasks_obj = new_tasks_obj;
      console.log("STATE TASKS OBJ, ", state.tasks_obj);
      state.loading = false;
    },
    addTask: (state, action) => {
      const { title, description, local_temp_id } = action.payload;
      state.tasks_obj[local_temp_id] = { local_temp_id, title, description };
    },
    updateTask: (state, action) => {
      const { task_id, title, description, created_at, local_temp_id, completed } = action.payload;
      // Updating older task
      if(state.tasks_obj[task_id]) { // Existing tasks with task_id created by external database
        state.tasks_obj[task_id] = { task_id, title, description, created_at, completed };
      }

      // Updating newer task with final values from database confirmation
      if(state.tasks_obj[local_temp_id]) { // New tasks with local_temp_id created by local state
        delete state.tasks_obj[local_temp_id];
        state.tasks_obj[task_id] = { task_id, title, description, created_at, completed };
      }
    },
    deleteTask: (state, action) => {
      const { task_id } = action.payload;
      delete state.tasks_obj[task_id];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask, setLoading } = tasksSlice.actions;
export const selectTasks = (state) => state.tasks;
export default tasksSlice.reducer;
