const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

/*
TASKS 
/api/users
*/

// Search functionality
router.get('/search', usersController.searchUsers);

// CRUD functionality
router.get('/', usersController.getAllUsers);
router.get('/:userId', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:userId', usersController.updateUser);
router.delete('/:userId', usersController.deleteUser);


module.exports = router;
