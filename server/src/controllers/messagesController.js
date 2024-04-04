const messagesModel = require('../models/messagesModel');

/*
exports.getMessagesByChatroomIdAndUserId = async (req, res) => {
    const chatroom_id = req.params.chatroomId;
    const user_id = req.params.userId;
    try {
        const messages = await messagesModel.m_getMessagesByChatroomIdAndUserId(chatroom_id, user_id);
        res.json(messages);
    } catch (error) {
        res.status(404).json({ error: 'Messages not found' });
    }
}

exports.getMessagesWaitingForRetrievalByChatroomId = async (req, res) => {
    const chatroom_id = req.params.chatroomId;
    const user_id = req.params.userId;
    try {
        const messages = await messagesModel.m_getMessagesWaitingForRetrievalByChatroomId(chatroom_id, user_id);
        res.json(messages);
    } catch (error) {
        res.status(404).json({ error: 'Messages not found' });
    }
}
*/


exports.getMessagesByChatroomId = async (req, res) => {
    const chatroom_id = req.params.chatroomId;
    
    try {
        const messages = await messagesModel.m_getMessagesByChatroomId(chatroom_id);
        res.json(messages);
    } catch (error) {
        res.status(404).json({ error: 'Messages not found' });
    }
}

exports.getMessageById = async (req, res) => {
    const message_id = req.params.messageId;
    try {
        const message = await messagesModel.m_getMessageById(message_id);
        res.json(message);
    } catch (error) {
        res.status(404).json({ error: 'Message not found' });
    }
};

exports.createMessage = async (req, res) => {
    const message_info = req.body;
    try {
        const new_message = await messagesModel.m_createMessage(message_info);
        res.status(201).json(new_message);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateMessage = async (req, res) => {
    const message_id = req.params.messageId;
    const updated_message_info = req.body;
    try {
        const updated_message = await messagesModel.m_updateMessage(message_id, updated_message_info);
        res.status(200).json(updated_message);
    } catch (error) {
        res.status(404).json({ error: 'Message not found (In Controller)' });
    }
};

exports.deleteMessage = async (req, res) => {
    const message_id = req.params.messageId;
    try {
        const deleted_message = await messagesModel.m_deleteMessage(message_id);
        res.json(deleted_message);
    } catch (error) {
        res.status(404).json({ error: 'Message not found' });
    }
};
