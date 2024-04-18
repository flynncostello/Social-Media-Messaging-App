import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import axios from 'axios';
import userAPI from '../../api/user';

import { API_ENDPOINT } from '../../api/index';

// Socket originates in this file and is also used in Chatroom.js for sending real-time messages
import io from 'socket.io-client';
export const socket = io('https://localhost:3000');

/*
All that is done in login is getting users data from database as well as current socket id and
adding that info to the slice
*/

const Login = () => {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_ENDPOINT}/login`, { username: loginUsername, password: loginPassword });

            if (data.success) {
                const sessionId = data.sessionId;
                console.log("This users session id is: ", sessionId);
                const user_data = data.user;
                user_data.is_active = true;

                // Getting socket id
                new Promise((resolve, reject) => {
                    // Emit
                    socket.emit('getSocketId');

                    // Receive
                    socket.once('sendSocketId', ({ socket_id }) => {
                        console.log("During login called get socket id and received my personal socket id: ", socket_id);
                        user_data.socket_id = socket_id;
                        resolve(socket_id);
                    });
                })
                .then(socket_id => {
                    console.log("Adding user info to slice")
                    dispatch(setUser(user_data)); // Sending data to redux slice
                    console.log("Sending user info to database, user info: ", user_data)
                    userAPI.updateUser(user_data.id, user_data); // Sending data to database

                    navigate(ROUTES.dashboard(user_data.id));
                })
               
            } else {
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
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
                    <input required type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input required type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Login;


