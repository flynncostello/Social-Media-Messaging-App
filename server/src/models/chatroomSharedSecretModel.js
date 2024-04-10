const supabase = require('../services/supabaseDatabaseService');

const chatroomSharedSecretModel = {
    m_getChatroomSharedSecretByChatroomId: async (chatroom_id) => {
        try {
            const { data } = await supabase.from("chatroom_shared_secret").select("*").eq("chatroom_id", chatroom_id);
            const shared_secret = data.length > 0 ? data[0] : null;
            if (shared_secret) {
                return shared_secret;
            } else {
                throw new Error('Shared secret not found');
            }
        } catch (error) {
            console.error('Error fetching shared secret by chatroom ID:', error);
            throw error;
        }
    },

    m_createChatroomSharedSecret: async (chatroom_info) => {
        const { chatroom_id, encrypted_shared_secret } = chatroom_info;
        try {
            const { data, error } = await supabase
                .from("chatroom_shared_secret")
                .insert([{ chatroom_id, encrypted_shared_secret }])
                .select();
            
            if (error) {
                console.error('Error creating new shared secret:', error);
                throw new Error('Error creating new shared secret');
            }

            const created_shared_secret = data[0];
            return created_shared_secret;

        } catch (error) {
            console.error('Error creating new shared secret:', error);
            throw error;
        }
    },

    m_deleteChatroomSharedSecret: async (chatroom_id) => {
        try {
            const { data, error } = await supabase
                .from("chatroom_shared_secret")
                .delete()
                .eq('chatroom_id', chatroom_id)
                .select();

            if (error) {
                console.error('Error deleting shared secret:', error);
                throw new Error('Shared secret in chatroom not found');
            }  

            const deleted_shared_secret = data[0];
            return deleted_shared_secret;

        } catch (error) {
            console.error('Error deleting shared secret in chatroom:', error);
            throw error;
        }
    }
};

module.exports = chatroomSharedSecretModel;
