const tasksModel = require('../models/tasksModel');

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await tasksModel.getAllTasks();
        res.json(tasks);
    } catch (error) {
        res.status(404).json({ error: 'Tasks not found' });
    }
}


exports.getTaskById = async (req, res) => {
    const task_id = req.params.taskId;
    try {
        const task = await tasksModel.getTaskById(task_id);
        res.json(task);
    } catch (error) {
        res.status(404).json({ error: 'Task not found' });
    }
};

exports.createTask = async (req, res) => {
    const task_info = req.body;
    try {
        const new_task = await tasksModel.createTask(task_info);
        res.status(201).json(new_task);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateTask = async (req, res) => {
    const task_id = req.params.taskId;
    const updated_task_info = req.body;
    try {
        const updated_task = await tasksModel.updateTask(task_id, updated_task_info);
        res.status(200).json(updated_task);
    } catch (error) {
        res.status(404).json({ error: 'Task not found' });
    }
};

exports.deleteTask = async (req, res) => {
    const task_id = req.params.taskId;
    try {
        const deleted_task = await tasksModel.deleteTask(task_id);
        res.json(deleted_task);
    } catch (error) {
        res.status(404).json({ error: 'Task not found' });
    }
};
