const supabase = require('../services/supabaseDatabaseService');

const messagesModel = {
    m_getMessageById: async (message_id) => {
        try {
            const { data } = await supabase.from("messages").select("*").eq("id", message_id);
            const message = data.length > 0 ? data[0] : null;
            if (message) {
                return message;
            } else {
                throw new Error('Message not found');
            }
        } catch (error) {
            console.error('Error fetching message by ID:', error);
            throw error;
        }
    },

    m_createMessage: async (message_info) => {
        const { chatroom_id, chatroom_index, sender_id, content } = message_info;
        try {
            const { data, error } = await supabase
                .from("messages")
                .insert([{ chatroom_id, chatroom_index, sender_id, content }])
                .select();
            
            if (error) {
                console.error('Error creating new message:', error);
                throw new Error('Error creating new message');
            }

            const created_message = data[0];
            return created_message;

        } catch (error) {
            console.error('Error creating new message:', error);
            throw error;
        }
    },

    m_updateMessage: async (message_id, updated_message_info) => {
        const { chatroom_index, content } = updated_message_info;
        try {
          const { data, error } = await supabase
            .from("messages")
            .update({ chatroom_index, content })
            .eq('id', message_id)
            .select();
                  
          if (error) {
            console.error('Error updating message:', error);
            throw new Error('Message not found (In Model)');
          }
      
          const updated_message = data[0];
          return updated_message;

        } catch (error) {
          console.error('Error updating message:', error);
          throw error;
        }
    },
            

    m_deleteMessage: async (message_id) => {
        try {
            const { data, error } = await supabase
                .from("messages")
                .delete()
                .eq('id', message_id)
                .select();

            if (error) {
                console.error('Error deleting message:', error);
                throw new Error('Message not found');
            }  

            const deleted_message = data[0];
            return deleted_message;

        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }
};

module.exports = messagesModel;
