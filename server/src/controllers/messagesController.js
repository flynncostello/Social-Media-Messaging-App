const messagesModel = require('../models/messagesModel');

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
