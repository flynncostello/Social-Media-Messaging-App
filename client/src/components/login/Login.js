import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { setUser } from '../../slices/userSlice';

import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

import axios from 'axios';

import userAPI from '../../api/user';


const Login = () => {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', { username: loginUsername, password: loginPassword });
            
            const data = response.data;
            console.log("DATA FROM LOGIN: ", data);
            if (data.success) {
                const user_data = data.user
                user_data.is_active = true;
                const user_info = { username: user_data.username, password: user_data.password, is_active: user_data.is_active };
                
                dispatch(setUser(user_data)); // Create storage slice for user data (Front-end only)
                userAPI.updateUser(user_data.id, user_info); // Update user's is_active status in database (Back-end only)

                console.log("User logged in successfully, id:", user_data.id)
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