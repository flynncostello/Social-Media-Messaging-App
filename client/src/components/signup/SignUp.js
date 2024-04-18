import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import ROUTES from '../../routes';

import bcrypt from 'bcryptjs'; // Used for secure hashing
import { derivePasswordEncryptionKey } from './signUpUtils';

import { API_ENDPOINT } from '../../api/index'

/*
Process:
- User enters username and password
- Derive password encrpyption key using password
- Hash users password with 10 salt rounds
- Send users username, hashed password, is_active, and public key to server
- Create user's public and private key
- Store password key and private key in local storage (names start with user's id), e.g., 2dfg83dsfg9tg5us65b0g6ef_private_key

Encryption things:
1) public key
2) private key
3) derived password key (used for symmetric encryption of messages)
*/

const Signup = () => {
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Check username is valid first
            const username_check_response = await axios.get(`${API_ENDPOINT}/checkusername`, { params: { username: signupUsername } });
            console.log('validUsername:', username_check_response)
            if (username_check_response.data.usernameExists) {
                console.error('SIGN UP ERROR: Username already exists');
                alert('Username already exists');
                return;
            }

            // Derive password encryption key using password
            const derived_password_key = await derivePasswordEncryptionKey(signupPassword);

            
            // Generating key pair
            const keyPair = await window.crypto.subtle.generateKey(
                {
                    name: 'RSA-OAEP',
                    modulusLength: 4096,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: 'SHA-256',
                },
                true,
                ['encrypt', 'decrypt']
            );

            // Export private key
            const exported_private_key = await window.crypto.subtle.exportKey(
                'pkcs8',
                keyPair.privateKey
            );

            // Convert private key to string
            const privateKeyString = btoa(String.fromCharCode.apply(null, new Uint8Array(exported_private_key)));


            // Export public key
            const exported_public_key = await window.crypto.subtle.exportKey(
                'spki',
                keyPair.publicKey
            );

            // Convert public key to string
            const publicKeyString = btoa(String.fromCharCode.apply(null, new Uint8Array(exported_public_key)));


            // Hashing password
            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(signupPassword, saltRounds); // Hashing password using 10 salt rounds


            // Sending username, hashed password, is_active, and public key to server
            const response = await axios.post(`${API_ENDPOINT}/signup`, {
                username: signupUsername,
                hashedPassword: hashedPassword,
                is_active: false,
                public_key: publicKeyString,
            });

            // Checking if sign up was successful
            if (response.status === 201) {
                console.log('User signed up successfully, username: ', signupUsername)

                // Getting user id
                const new_user_id = response.data.id;

                // Adding password encryption key to local storage along with user's id for identification
                localStorage.setItem(`${new_user_id}_message_encryption_key`, derived_password_key);

                // Store private key in localStorage
                localStorage.setItem(`${new_user_id}_private_key`, privateKeyString);

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
