const express = require('express');
const router = express.Router();

const chatroomsController = require('../controllers/chatroomsController');

/*
TASKS 
/api/chatrooms
*/
// /api/chatroom/user/:userId
router.get('/user/:userId', chatroomsController.getChatroomsByUserId);

router.get('/:chatroomId', chatroomsController.getChatroomById);
router.post('/', chatroomsController.createChatroom);
router.delete('/:chatroomId', chatroomsController.deleteChatroom);

module.exports = router;
