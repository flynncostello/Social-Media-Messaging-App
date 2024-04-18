const usersModel = require('../models/usersModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await usersModel.m_getAllUsers();
        //console.log("USERS IN SERVER CONTROLLER, ", users)
        res.json(users);
    } catch (error) {
        res.status(404).json({ error: 'Users not found' });
    }
}

exports.getUserById = async (req, res) => {
    const user_id = req.params.userId;
    //console.log("USER ID: ", user_id)
    try {
        const user = await usersModel.m_getUserById(user_id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};

exports.createUser = async (req, res) => {
    const user_info = req.body;
    try {
        const new_user = await usersModel.m_createUser(user_info);
        res.status(201).json(new_user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    const user_id = req.params.userId;
    const updated_user_info = req.body;
    //console.log("IN CONTROLLER USER INFO: ", updated_user_info)
    try {
        const updated_user = await usersModel.m_updateUser(user_id, updated_user_info);
        res.status(200).json(updated_user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};

exports.deleteUser = async (req, res) => {
    const user_id = req.params.userId;
    try {
        const deleted_user = await usersModel.m_deleteUser(user_id);
        res.json(deleted_user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};

exports.searchUsers = async (req, res) => {
    const searchTerm = req.query.username;
    console.log(searchTerm)
    try {
        const users = await usersModel.m_searchUsersByUsername(searchTerm);
        res.json(users);
    } catch (error) {
        res.status(404).json({ error: 'Users not found' });
    }
};
