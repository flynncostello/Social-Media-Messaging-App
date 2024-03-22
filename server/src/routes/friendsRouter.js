const express = require('express');
const router = express.Router();

const friendsController = require('../controllers/friendsController');

/*
TASKS 
/api/friends
*/
router.get('/:userId', friendsController.getUsersFriends);
router.post('/', friendsController.createFriendship);
router.delete('/:friendshipId', friendsController.deleteFriendship);

module.exports = router;
