const supabase = require('../services/supabaseDatabaseService');

const friendsModel = {
    m_getUsersFriends: async (user_id) => {
        try {
            const { data } = await supabase.from("friends").select("*").eq("user_id", user_id);
            return data; // Friends will either contain objects of friends or be empty signifying no friends
        } catch (error) {
            console.error('Error fetching friends by user ID:', error);
            throw error;
        }
    },

    m_createFriendship: async (user_id, friend_id) => {
        try {
            const { data, error } = await supabase
                .from("friends")
                .insert([{ user_id, friend_id }])
                .select();
            
            if (error) {
                console.error('Error creating new friendship:', error);
                throw new Error('Error creating new friendship');
            }

            const created_friendship = data[0];
            return created_friendship;

        } catch (error) {
            console.error('Error creating new friendship:', error);
            throw error;
        }
    },

    m_deleteFriendship: async (friendship_id) => {
        try {
            const { data, error } = await supabase
                .from("friends")
                .delete()
                .eq('id', friendship_id)
                .select();

            if (error) {
                console.error('Error deleting friendship:', error);
                throw new Error('Friendship not found');
            }  

            const deleted_friendship = data[0];
            return deleted_friendship;

        } catch (error) {
            console.error('Error deleting friendship:', error);
            throw error;
        }
    }
};

module.exports = friendsModel;
