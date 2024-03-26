import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import { setUser } from '../../slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
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
            if (data.success) {
                const user_data = data.user
                user_data.is_active = true;
                alert('Logged in successfully!');
                console.log("USER INFO: ", user_data);
                // Updating user information in database, i.e., making user active now
                const user_info = { username: user_data.username, password: user_data.password, is_active: user_data.is_active };
                userAPI.updateUser(user_data.id, user_info); // Update user's is_active status
                dispatch(setUser(user_data)); // Create storage slice for user data
                //localStorage.setItem('userId', data.userId); // Store the user ID in localStorage
                navigate(ROUTES.dashboard(user_data.id)); // Redirect to Dashboard
            } else {
                alert('Login failed:', data.message);
            }
        } catch (error) {
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