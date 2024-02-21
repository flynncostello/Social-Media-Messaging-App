const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasksController');

/*
TASKS 
/api/tasks
*/
router.get('/', tasksController.getAllTasks);
router.get('/:taskId', tasksController.getTaskById);
router.post('/', tasksController.createTask);
router.put('/:taskId', tasksController.updateTask);
router.delete('/:taskId', tasksController.deleteTask);

module.exports = router;
