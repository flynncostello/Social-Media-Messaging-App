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

import { API_ENDPOINT } from '../../api/index'
import './UserAccount.css';

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

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (confirmDelete) {
      try {
        await userAPI.deleteUser(user.id);

        alert('Account deleted successfully!');
        dispatch(clearUserSlice());
        dispatch(clearFriendsSlice());
        dispatch(clearRequests());
        dispatch(resetChatroom());
        navigate('/');

        const response = await axios.get(`${API_ENDPOINT}/logout`);
  
        if (response.data.success) {
          alert('Account deleted successfully!');
          dispatch(clearUserSlice());
          dispatch(clearFriendsSlice());
          dispatch(clearRequests());
          dispatch(resetChatroom());
          navigate('/');
        } else {
          alert('Failed to logout after deleting account.');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again later.');
      }
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      userAPI.updateUser(user.id, { is_active: false })

      alert('Logged out successfully!');                
      dispatch(clearUserSlice()); // Clear user slice
      dispatch(clearFriendsSlice()); // Clear friends slice
      dispatch(clearRequests()); // Clear friend requests slice
      dispatch(resetChatroom()); // Clear chatroom slice
      navigate('/'); // Redirect to home page

      const response = await axios.get(`${API_ENDPOINT}/logout`);
      
      if (response.data.success) {
        alert('Logged out successfully!');                
        dispatch(clearUserSlice()); // Clear user slice
        dispatch(clearFriendsSlice()); // Clear friends slice
        dispatch(clearRequests()); // Clear friend requests slice
        dispatch(resetChatroom()); // Clear chatroom slice
        navigate('/'); // Redirect to home page
      } else {
          alert('Logout failed:', response.data.message);
      }
    } catch (error) {
        alert('Error: ' + error);
    }
};

  return (
    <div className='user-account-page'>
      <div className='user-info-container'>
        {/* User Information */}
        <h1>User Account</h1>
        <p>User ID: {user.id}</p>
        <p>Username: {user.username}</p>
        {/* <p>Password: {user.password}</p> Not displaying password */}
        <p>Is Active: {user.is_active ? 'Yes' : 'No'}</p>
      </div>
      <div className='user-account-buttons'>
        {/* Buttons */}
        <button onClick={handleDeleteAccount}>Delete Account</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserAccount;