import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../slices/userSlice';

// Importing components used on dashboard
import User from '../user/User';
import Friends from './friendsList/Friends';
import NewFriend from './addNewFriend/NewFriend';
import FriendRequests from './friendRequests/FriendRequests';

import './Dashboard.css';

const Dashboard = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const user = useSelector(selectUser);
    //console.log("IN DASHBOARD, CURRENT STATE OF USER SLICE: ", user)

    return (
        <div className='dashboard'>
            {/* Contains top bit with user icon and add new friend as well as list of friends below */}
            <div className='left-sidebar'>
                <div className='top-icons'>
                    <User />
                    <NewFriend />
                </div>
                <div className='search-bar'>

                </div>
                <div className='friends-list'>
                    <Friends />
                </div>
            </div>
                
            {/* Contains either friend requests and logo below or current chatroom if friend has been clicked on */}
            <div className='right-area'>
                {chatOpen ? (
                    <div>
                        <h1>Chatroom</h1>
                    </div>
                ) : (
                    <div>
                        <FriendRequests />
                    </div>
                )}
            </div>
            
            {/*
            <div className='placeholder-text'>
                <h1>Welcome to your Dashboard</h1>
                <p>User ID: {user.id}</p>
                <p>Username: {user.username}</p>
                <p>Password: {user.password}</p>
                <p>Is Active: {user.is_active ? 'Yes' : 'No'}</p>
            </div>
            */}
        </div>
    );
};

export default Dashboard;