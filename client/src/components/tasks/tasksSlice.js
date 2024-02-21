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
      // action.payload should be an object with task_id as keys
      state.tasks_obj = action.payload;
      state.loading = false;
    },
    addTask: (state, action) => {
      const newTask = action.payload;
      state.tasks_obj[newTask.task_id] = newTask;
    },
    updateTask: (state, action) => {
      const { task_id, title, description } = action.payload;
      const existingTask = state.tasks_obj[task_id];
      if (existingTask) {
        existingTask.title = title;
        existingTask.description = description;
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
