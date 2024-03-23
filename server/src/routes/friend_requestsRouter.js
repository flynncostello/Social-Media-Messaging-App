const express = require('express');
const router = express.Router();

const friend_requestsController = require('../controllers/friend_requestsController');

/*
TASKS 
/api/friend_requests
*/
router.get('/sent/:userId', friend_requestsController.getFriendRequestsSent);
router.get('/received/:userId', friend_requestsController.getFriendRequestsReceived);
router.post('/', friend_requestsController.createFriendRequest);
router.put('/received/:requestId', friend_requestsController.changeFriendRequestStatus);
router.delete('/:requestId', friend_requestsController.deleteFriendRequest);

module.exports = router;
