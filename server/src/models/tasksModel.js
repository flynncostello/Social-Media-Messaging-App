const supabase = require('../services/databaseService');

const tasksModel = {
    getAllTasks: async () => {
        try {
            const { data } = await supabase.from("tasks").select("*");
            return data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    getTaskById: async (task_id) => {
        try {
            const { data } = await supabase.from("tasks").select("*").eq("task_id", task_id);
            const task = data.length > 0 ? data[0] : null;
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
        const { title, description } = task_info;
        try {
            const { data, error } = await supabase
                .from("tasks")
                .insert([{ title, description }])
                .select();
            
            if (error) {
                console.error('Error creating new task:', error);
                throw new Error('Error creating new task');
            }

            const created_task = data[0];
            return created_task;

        } catch (error) {
            console.error('Error creating new task:', error);
            throw error;
        }
    },

    updateTask: async (task_id, updated_task_info) => {
        const { title, description } = updated_task_info;
      
        try {
          const { data, error } = await supabase
            .from("tasks")
            .update({ title, description })
            .match({ task_id })
            .select();
                  
          if (error) {
            console.error('Error updating task:', error);
            throw new Error('Task not found');
          }
      
          const updated_task = data[0];
          return updated_task;

        } catch (error) {
          console.error('Error updating task:', error);
          throw error;
        }
    },
            

    deleteTask: async (task_id) => {
        try {
            const { data, error } = await supabase
                .from("tasks")
                .delete()
                .match({ task_id })
                .select();

            if (error) {
                console.error('Error deleting task:', error);
                throw new Error('Task not found');
            }  

            const deleted_task = data[0];
            return deleted_task;

        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
};

module.exports = tasksModel;
