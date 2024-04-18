const friendsModel = require('../models/friendsModel');

exports.getUsersFriends = async (req, res) => {
    console.log("Users id is: ", req.params.userId);
    console.log("Users current session info: ", req.session);

    const user_id = req.params.userId;
    try {
        const users_friends = await friendsModel.m_getUsersFriends(user_id);
        //console.log("USERS FRIENDSHIPS: ", users_friends)
        res.json(users_friends);
    } catch (error) {
        res.status(404).json({ error: 'User friends not found' });
    }
};

exports.createFriendship = async (req, res) => {
    const { user_id, friend_id } = req.body;
    try {
        const new_friendship = await friendsModel.m_createFriendship(user_id, friend_id);
        res.status(201).json(new_friendship);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteFriendship = async (req, res) => {
    const friendship_id = req.params.friendshipId;
    try {
        const deleted_friendship = await friendsModel.m_deleteFriendship(friendship_id);
        res.json(deleted_friendship);
    } catch (error) {
        res.status(404).json({ error: 'Friendship not found' });
    }
};
