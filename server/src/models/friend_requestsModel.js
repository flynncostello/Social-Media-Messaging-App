const supabase = require('../services/supabaseDatabaseService');

const friend_requestsModel = {
    m_getFriendRequestsSent: async (user_id) => {
        try {
            const { data } = await supabase.from("friend_requests").select("*").eq("sender_id", user_id);
            const friend_requests_sent = data.length > 0 ? data : null;
            if (friend_requests_sent) {
                //console.log(friend_requests_sent)
                return friend_requests_sent;
            } else {
                return []; // No friend requests sent
            }
        } catch (error) {
            console.error('Error fetching friend requests sent by user:', error);
            throw error;
        }
    },

    m_getFriendRequestsReceived: async (user_id) => {
        try {
            const { data } = await supabase.from("friend_requests").select("*").eq("receiver_id", user_id);
            const friend_requests_received = data.length > 0 ? data : null;
            if (friend_requests_received) {
                return friend_requests_received;
            } else {
                return []; // No friend requests received
            }
        } catch (error) {
            console.error('Error fetching friend requests received by user:', error);
            throw error;
        }
    },

    m_createFriendRequest: async (request_info) => {
        const { sender_id, receiver_id, status='PENDING' } = request_info;
        try {
            const { data, error } = await supabase
                .from("friend_requests")
                .insert([{ sender_id, receiver_id, status }])
                .select();
            
            if (error) {
                console.error('Error creating new friend request:', error);
                throw new Error('Error creating new friend request');
            }

            const created_friend_request = data[0];
            return created_friend_request;

        } catch (error) {
            console.error('Error creating new friend request:', error);
            throw error;
        }
    },

    m_changeFriendRequestStatus: async (requestId, status) => {
        //console.log("REQUEST ID: ", requestId)
        //console.log("STATUS: ", status)
        try {
          const { data, error } = await supabase
            .from("friend_requests")
            .update({ status })
            .eq('id', requestId)
            .select();
                  
          if (error) {
            console.error('Error updating friend request:', error);
            throw new Error('Friend request not found');
          }
      
          const updated_user = data[0];
          return updated_user;

        } catch (error) {
          console.error('Error updating friend request:', error);
          throw error;
        }
    },

    m_deleteFriendRequest: async (requestId) => {
        try {
            const { data, error } = await supabase
                .from("friend_requests")
                .delete()
                .eq('id', requestId)
                .select();
            
            if (error) {
                console.error('Error deleting friend request:', error);
                throw new Error('Friend request not found');
            }
        
            const deleted_friend_request = data[0];
            return deleted_friend_request;
        } catch (error) {
            console.error('Error deleting friend request:', error);
            throw error;
        }
    }
};

module.exports = friend_requestsModel;
