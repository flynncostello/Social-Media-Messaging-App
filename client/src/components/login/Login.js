import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { setUser } from '../../slices/userSlice';

import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

import axios from 'axios';

import userAPI from '../../api/user';


/*
Process:
- User enters username and password
- Once details have been confirmed we start the current users session
- Dispatches a setUser action to userSlice to initliaze the user slice with user data
including id, username, password, and is_active
*/

const Login = () => {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', { username: loginUsername, password: loginPassword });
            const data = response.data; // This includes message, success state, and user object

            if (data.success) {
                const user_data = data.user // This includes created_at, id, is_active, password, username
                //console.log("USER DATA FROM SERVER: ", user_data)
                user_data.is_active = true;
                
                dispatch(setUser(user_data)); // Create storage slice for user data (Front-end only)
                userAPI.updateUser(user_data.id, user_data); // Update user's is_active status in database (Back-end only)

                //console.log("User logged in successfully, with username: ", user_data.username)
                navigate(ROUTES.dashboard(user_data.id)); // Redirect to Dashboard
            } else {
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
            // Handle other types of errors
            console.error('Error:', error);
            alert('Error: ' + error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Username:
                    <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Login;