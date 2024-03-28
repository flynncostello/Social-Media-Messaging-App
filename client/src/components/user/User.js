import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as regularUserIcon } from '@fortawesome/free-regular-svg-icons';
import { faUser as solidUserIcon, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../slices/userSlice';

import userAPI from '../../api/user';

import './User.css';

import ROUTES from '../../routes';

const User = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:3000/api/logout');
            if (response.data.success) {
                alert('Logged out successfully!');
                userAPI.updateUser(user.id, { is_active: false })
                navigate('/');
            } else {
                alert('Logout failed:', response.data.message);
            }
            // Also need to clear user slice - need to clear all slices
        } catch (error) {
            alert('Error: ' + error);
        }
    };
    
    const handleAccountSettings = () => {
        console.log("Going to account settings of user with id: ", user.id);
        navigate(ROUTES.userAccount(user.id))
    }

    return (
        <div className='user'>
            <div className={`user-icon ${isOpen ? 'active' : ''}`} onClick={handleClick}>
                <FontAwesomeIcon icon={isOpen ? solidUserIcon : regularUserIcon} />
            </div>
            {isOpen && (
                <div className="dropdown">
                    <button onClick={handleAccountSettings}>Account Settings</button>
                    <button onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default User;
