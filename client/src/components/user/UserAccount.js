import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, clearUser } from '../../slices/userSlice';
import userAPI from '../../api/user';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { clearUserSlice } from '../../slices/userSlice';
import { clearFriendsSlice } from '../../slices/friendsSlice';
import { clearRequests } from '../../slices/friendRequestsSlice';
import { resetChatroom } from '../../slices/chatroomSlice';

/*
Process:
- Starts by just showing id, username, and is_active state
- When user deletes their account it deletes from the database and clears all slices
- When user logs out it simply changes is_active state in database and clears all slices
*/


const UserAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (confirmDelete) {
      //console.log('Deleting account of user with ID:', user.id);
      userAPI.deleteUser(user.id)
        .then(() => {
          alert('Account deleted successfully!');
          dispatch(clearUserSlice()); // Clear user slice
          dispatch(clearFriendsSlice()); // Clear friends slice
          dispatch(clearRequests()); // Clear friend requests slice
          dispatch(resetChatroom()); // Clear chatroom slice
          navigate('/');
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
          alert('Failed to delete account. Please try again later.');
        });
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get('http://localhost:3000/api/logout');
        if (response.data.success) {
            alert('Logged out successfully!');
            userAPI.updateUser(user.id, { is_active: false })
            dispatch(clearUserSlice()); // Clear user slice
            dispatch(clearFriendsSlice()); // Clear friends slice
            navigate('/');
        } else {
            alert('Logout failed:', response.data.message);
        }
        // Also need to clear user slice - need to clear all slices
    } catch (error) {
        alert('Error: ' + error);
    }
};

  return (
    <div>
      <div>
        {/* User Information */}
        <h1>User Account</h1>
        <p>User ID: {user.id}</p>
        <p>Username: {user.username}</p>
        {/* <p>Password: {user.password}</p> Not displaying password */}
        <p>Is Active: {user.is_active ? 'Yes' : 'No'}</p>
      </div>
      <div>
        {/* Buttons */}
        <button onClick={handleDeleteAccount}>Delete Account</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserAccount;