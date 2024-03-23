const express = require('express');
const router = express.Router();

const chatroomsController = require('../controllers/chatroomsController');

/*
TASKS 
/api/chatrooms
*/

router.get('/:chatroomId', chatroomsController.getChatroomById);
router.post('/', chatroomsController.createChatroom);
router.delete('/:chatroomId', chatroomsController.deleteChatroom);

module.exports = router;
