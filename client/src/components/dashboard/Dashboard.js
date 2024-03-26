import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../slices/userSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    return (
        <div>
            <h1>Welcome to your Dashboard</h1>
            <p>User ID: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>Password: {user.password}</p>
            <p>Is Active: {user.is_active ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default Dashboard;