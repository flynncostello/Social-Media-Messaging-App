const chatroomSharedSecretModel = require('../models/chatroomSharedSecretModel');

exports.getChatroomSharedSecretByChatroomId = async (req, res) => {
    const chatroom_id = req.params.chatroomId;
    try {
        const encrypted_secret_key = await chatroomSharedSecretModel.m_getChatroomSharedSecretByChatroomId(chatroom_id);
        res.json(encrypted_secret_key);
    } catch (error) {
        res.status(404).json({ error: 'Chatroom shared secret not found' });
    }
};

exports.createChatroomSharedSecret = async (req, res) => {
    const chatroom_info = req.body;
    try {
        const new_chatroom_shared_secret = await chatroomSharedSecretModel.m_createChatroomSharedSecret(chatroom_info);
        res.status(201).json(new_chatroom_shared_secret);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteChatroomSharedSecret = async (req, res) => {
    const chatroom_id = req.params.chatroomId;
    try {
        const deleted_chatroom_shared_secret = await chatroomSharedSecretModel.m_deleteChatroomSharedSecret(chatroom_id);
        res.json(deleted_chatroom_shared_secret);
    } catch (error) {
        res.status(404).json({ error: 'Chatroom shared secret not found' });
    }
};

