import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import ROUTES from '../../routes';

import bcrypt from 'bcryptjs'; // Used for secure hashing

/*
Process:
- User enters username and password
- User details are sent to server and stored in database
- userSlice not impacted
*/

const Signup = () => {
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(signupPassword, saltRounds); // Hashing password using 10 salt rounds

            const response = await axios.post('http://localhost:3000/api/signup', {
                username: signupUsername,
                hashedPassword: hashedPassword,
                is_active: false,
            });
        
            if (response.status === 201) {
                console.log('User signed up successfully, username:', signupUsername)
                navigate(ROUTES.login()); // Redirect to login page
            } else {
                // Unexpected error
                console.error('SIGN UP ERROR:', response.data.error);
                alert(response.data.error);
            }

        } catch (error) {
            // Other errors
            console.error('Error:', error);
            alert('Error: ' + error);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <label>
                    Username:
                    <input required type="text" value={signupUsername} onChange={e => setSignupUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input required type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Signup;
