const pool = require('../services/databaseService');

const tasksModel = {
  getAllTasks: async () => {
    try {
      const result = await pool.query('SELECT * FROM tasks');
      return result.rows;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  getTaskById: async (task_id) => {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE task_id = $1', [task_id]);
      const task = result.rows.length > 0 ? result.rows[0] : null;
      if (task) {
        return task;
      } else {
        throw new Error('Task not found');
      }
    } catch (error) {
      console.error('Error fetching task by ID:', error);
      throw error;
    }
  },

  createTask: async (task_info) => {
    const { title, description, local_temp_id } = task_info;
    try {
      const result = await pool.query(
        'INSERT INTO tasks (title, description, local_temp_id) VALUES ($1, $2, $3) RETURNING *',
        [title, description, local_temp_id]
      );
      
      const created_task = result.rows[0];
      return created_task;
    } catch (error) {
      console.error('Error creating new task:', error);
      throw error;
    }
  },

  updateTask: async (task_id, updated_task_info) => {
    const { title, description, completed } = updated_task_info;
  
    try {
      const result = await pool.query(
        'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE task_id = $4 RETURNING *',
        [title, description, completed, task_id]
      );
              
      const updated_task = result.rows[0];
      return updated_task;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (task_id) => {
    try {
      const result = await pool.query('DELETE FROM tasks WHERE task_id = $1 RETURNING *', [task_id]);

      const deleted_task = result.rows[0];
      return deleted_task;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};

module.exports = tasksModel;
