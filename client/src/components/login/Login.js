import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/login', { username: loginUsername, password: loginPassword });
            const data = response.data;
            if (data.success) {
                alert('Logged in successfully!');
                console.log("USER ID: ", data.userId);
                localStorage.setItem('userId', data.userId); // Store the user ID in localStorage
                navigate('/user'); // Redirect to UserPage
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