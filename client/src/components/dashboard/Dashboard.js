import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../slices/userSlice';

// Importing components used on dashboard
import User from '../user/User';
import Friends from './friendsList/Friends';

const Dashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    return (
        <div>
            {/* Contains top bit with user icon and add new friend as well as list of friends below */}
            <div className='left-sidebar'>
                <div className='top-icons'>
                    <User />

                </div>
                <div className='search-bar'>

                </div>
                <div className='friends-list'>
                    <Friends />
                </div>
            </div>
                
            {/* Contains either friend requests and logo below or current chatroom if friend has been clicked on */}
            <div className='right-area'>

            </div>

            <h1>Welcome to your Dashboard</h1>
            <p>User ID: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>Password: {user.password}</p>
            <p>Is Active: {user.is_active ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default Dashboard;