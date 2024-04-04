const express = require('express');
const router = express.Router();

const messagesController = require('../controllers/messagesController');

/*
TASKS
/api/messages
*/

/* When user first opens chatroom up again we want to retrieve all messages that either have both chatroom_id and storer_id
as well as entries which are waiting_for_retrieval and are from the correct chatroom_id and whose sender id is not the user_id
*/
/*
router.get('/chatroom/:chatroomId/storedBy/:userId', messagesController.getMessagesByChatroomIdAndUserId);
router.get('/chatroom/:chatroomId/messagesWaitingFor/:userId', messagesController.getMessagesWaitingForRetrievalByChatroomId);
*/

router.get('/chatroom/:chatroomId', messagesController.getMessagesByChatroomId);
router.get('/:messageId', messagesController.getMessageById);
router.post('/', messagesController.createMessage);
router.put('/:messageId', messagesController.updateMessage);
router.delete('/:messageId', messagesController.deleteMessage);

module.exports = router;
