const express = require('express');
const router = express.Router();

const chatroomSharedSecretController = require('../controllers/chatroomSharedSecretController');

router.get('/:chatroomId', chatroomSharedSecretController.getChatroomSharedSecretByChatroomId);
router.post('/', chatroomSharedSecretController.createChatroomSharedSecret);
router.delete('/:chatroomId', chatroomSharedSecretController.deleteChatroomSharedSecret);

module.exports = router;
