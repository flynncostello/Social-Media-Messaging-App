const friend_requestsModel = require('../models/friend_requestsModel');

exports.getFriendRequestsSent = async (req, res) => {
    const user_id = req.params.userId;
    try {
        const friend_requests_sent = await friend_requestsModel.m_getFriendRequestsSent(user_id);
        res.json(friend_requests_sent);
    } catch (error) {
        res.status(404).json({ error: 'Friend requests sent not found' });
    }
};

exports.getFriendRequestsReceived = async (req, res) => {
    const user_id = req.params.userId;
    try {
        const friend_requests_received = await friend_requestsModel.m_getFriendRequestsReceived(user_id);
        res.json(friend_requests_received);
    } catch (error) {
        res.status(404).json({ error: 'Friend requests received not found' });
    }
};

exports.createFriendRequest = async (req, res) => {
    const friend_request_info = req.body;
    try {
        const new_friend_request = await friend_requestsModel.m_createFriendRequest(friend_request_info);
        res.status(201).json(new_friend_request);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.changeFriendRequestStatus = async (req, res) => {
    const request_id = req.params.requestId;
    const new_status = req.body.status;
    try {
        const updated_friend_request = await friend_requestsModel.m_changeFriendRequestStatus(request_id, new_status);
        res.status(200).json(updated_friend_request);
    } catch (error) {
        res.status(404).json({ error: 'Friend request not found' });
    }
};

exports.deleteFriendRequest = async (req, res) => {
    const request_id = req.params.requestId;
    try {
        const deleted_friend_request = await friend_requestsModel.m_deleteFriendRequest(request_id);
        res.json(deleted_friend_request);
    } catch (error) {
        res.status(404).json({ error: 'Friend request not found' });
    }
};
