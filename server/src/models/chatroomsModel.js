const supabase = require('../services/supabaseDatabaseService');

const chatroomsModel = {
    m_getChatroomById: async (chatroom_id) => {
        try {
            const { data } = await supabase.from("chatrooms").select("*").eq("id", chatroom_id);
            const chatroom = data.length > 0 ? data[0] : null;
            if (chatroom) {
                return chatroom;
            } else {
                throw new Error('Chatroom not found');
            }
        } catch (error) {
            console.error('Error fetching chatroom by ID:', error);
            throw error;
        }
    },
    m_getChatroomsByUserId: async (user_id) => {
        try {
            const { data } = await supabase
                .from("chatrooms")
                .select("*")
                .or(`host_id.eq.${user_id},participant_id.eq.${user_id}`);
                return data; // User can be either host or participant, either way they're in the chatroom
        } catch (error) {
            console.error('Error fetching chatrooms by user ID:', error);
            throw error;
        }
    },
    m_createChatroom: async (chatroom_info) => {
        console.log("CHATROOM INFO: ", chatroom_info)
        const { host_id, participant_id } = chatroom_info;
        try {
            const { data, error } = await supabase
                .from("chatrooms")
                .insert([{ host_id, participant_id }])
                .select();
            
            if (error) {
                console.error('Error creating new chatroom:', error);
                throw new Error('Error creating new chatroom');
            }

            const created_chatroom = data[0];
            return created_chatroom;

        } catch (error) {
            console.error('Error creating new chatroom:', error);
            throw error;
        }
    }, 

    m_deleteChatroom: async (chatroom_id) => {
        try {
            const { data, error } = await supabase
                .from("chatrooms")
                .delete()
                .eq('id', chatroom_id)
                .select();

            if (error) {
                console.error('Error deleting chatroom:', error);
                throw new Error('Chatroom not found');
            }  

            const deleted_chatroom = data[0];
            return deleted_chatroom;

        } catch (error) {
            console.error('Error deleting chatroom:', error);
            throw error;
        }
    }
};

module.exports = chatroomsModel;
