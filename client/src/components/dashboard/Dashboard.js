import React from 'react';
import User from '../user/User';
import Friends from './friendsList/Friends';
import NewFriend from './addNewFriend/NewFriend';
import Chatroom from './chatroom/Chatroom';
import FriendRequests from './friendRequests/FriendRequests';

import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className='dashboard'>
            {/* Left Column */}
            <div className='left-column'>
                {/* Top Icons */}
                <div className='top-icons'>
                    <User />
                    <NewFriend />
                </div>
                {/* Search Bar */}
                <div className='search-bar'>

                </div>
                {/* Friends List */}
                <Friends />
            </div>

            {/* Middle Column */}
            <div className='middle-column'>
                <Chatroom />
            </div>

            {/* Right Column */}
            <div className='right-column'>
                {/* Friend Requests */}
                <FriendRequests />
            </div>

        </div>
    );
};

export default Dashboard;


