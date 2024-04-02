const chatroomsModel = require('../models/chatroomsModel');

exports.getChatroomById = async (req, res) => {
    const chatroom_id = req.params.chatroomId;
    try {
        const chatroom = await chatroomsModel.m_getChatroomById(chatroom_id);
        res.json(chatroom);
    } catch (error) {
        res.status(404).json({ error: 'Chatroom not found' });
    }
};

exports.getChatroomsByUserId = async (req, res) => {
    const user_id = req.params.userId;
    try {
        const chatrooms = await chatroomsModel.m_getChatroomsByUserId(user_id);
        res.json(chatrooms);
    } catch (error) {
        res.status(404).json({ error: 'Chatrooms not found' });
    }
}

exports.createChatroom = async (req, res) => {
    const chatroom_info = req.body;
    try {
        const new_chatroom = await chatroomsModel.m_createChatroom(chatroom_info);
        res.status(201).json(new_chatroom);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteChatroom = async (req, res) => {
    const chatroom_id = req.params.chatroomId;
    try {
        const deleted_chatroom = await chatroomsModel.m_deleteChatroom(chatroom_id);
        res.json(deleted_chatroom);
    } catch (error) {
        res.status(404).json({ error: 'Chatroom not found' });
    }
};
