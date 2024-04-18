const supabase = require('../services/supabaseDatabaseService');

const usersModel = {
    m_getAllUsers: async () => {
        try {
            const { data } = await supabase.from("users").select("*");
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    m_getUserById: async (user_id) => {
        try {
            const { data } = await supabase.from("users").select("*").eq("id", user_id);
            const user = data.length > 0 ? data[0] : null;
            if (user) {
                return user;
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    },

    m_createUser: async (user_info) => {
        console.log(user_info)
        const { username, password, is_active, socket_id = '' } = user_info;
        try {
            const { data, error } = await supabase
                .from("users")
                .insert([{ username, password, is_active, socket_id }])
                .select();
            
            if (error) {
                console.error('Error creating new user:', error);
                throw new Error('Error creating new user');
            }

            const created_user = data[0];
            return created_user;

        } catch (error) {
            console.error('Error creating new user:', error);
            throw error;
        }
    },

    m_updateUser: async (user_id, updated_user_info) => {
        const { username, password, is_active, public_key, socket_id } = updated_user_info;
        //console.log('UPDATED USER INFO USER UPDATE: ', updated_user_info)
      
        try {
          const { data, error } = await supabase
            .from("users")
            .update({ username, password, is_active, public_key, socket_id })
            .eq('id', user_id)
            .select();
                  
          if (error) {
            console.error('Error updating user:', error);
            throw new Error('User not found');
          }
      
          const updated_user = data[0];
          return updated_user;

        } catch (error) {
          console.error('Error updating user:', error);
          throw error;
        }
    },
            

    m_deleteUser: async (user_id) => {
        try {
            const { data, error } = await supabase
                .from("users")
                .delete()
                .eq('id', user_id)
                .select();

            if (error) {
                console.error('Error deleting user:', error);
                throw new Error('User not found');
            }  

            const deleted_user = data[0];
            return deleted_user;

        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    m_searchUsersByUsername: async (searchTerm) => {
        try {
            const { data } = await supabase
                .from('users')
                .select('id, username')
                .ilike('username', `${searchTerm}%`);
            return data;
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }
};

module.exports = usersModel;
