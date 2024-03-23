const express = require('express');
const router = express.Router();

const messagesController = require('../controllers/messagesController');

/*
TASKS 
/api/messages
*/
router.get('/:messageId', messagesController.getMessageById);
router.post('/', messagesController.createMessage);
router.put('/:messageId', messagesController.updateMessage);
router.delete('/:messageId', messagesController.deleteMessage);

module.exports = router;
