import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import axios from 'axios';
import userAPI from '../../api/user';
//import crypto from 'crypto';
import { Buffer } from 'buffer';

import io from 'socket.io-client';
export const socket = io('http://localhost:3000');

const derivePasswordEncryptionKey = async (password) => {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Use a constant salt
    const salt = new TextEncoder().encode('S0m3C0mpl3xStr1ng');

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );

    const encryptionKey = await crypto.subtle.deriveKey(
        {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-CBC', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    // Store the encryption key in localStorage
    const exportedEncryptionKey = await crypto.subtle.exportKey('raw', encryptionKey);
    const encryptionKeyStr = Buffer.from(new Uint8Array(exportedEncryptionKey)).toString('hex');
    localStorage.setItem('userEncryptionKey', encryptionKeyStr); // Sets encryption key in local storage for symmetric encryption

    //return encryptionKeyStr;
};



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
                // Deriving encryption key from password and storing in localStorage
                derivePasswordEncryptionKey(loginPassword);

                const user_data = data.user;
                user_data.is_active = true;

                // Generate key pair
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

                // Store private key in localStorage
                localStorage.setItem('private_key', privateKeyString);

                // Export public key
                const exported_public_key = await window.crypto.subtle.exportKey(
                    'spki',
                    keyPair.publicKey
                );

                // Convert public key to string
                const publicKeyString = btoa(String.fromCharCode.apply(null, new Uint8Array(exported_public_key)));
                //console.log('Public key:', publicKeyString);
                // Add public key to user data
                user_data.public_key = publicKeyString;

                // Getting socket id
                new Promise((resolve, reject) => {
                    // Emit
                    socket.emit('getSocketId');

                    // Receive
                    socket.once('sendSocketId', ({ socket_id }) => {
                        console.log("Received socket id: ", socket_id);
                        user_data.socket_id = socket_id;
                        resolve(socket_id);
                    });

                })
                .then(socket_id => {
                    console.log("Promise resolved with socket id: ", socket_id);
                    console.log("User data socket id: ", user_data.socket_id);
                    console.log("Adding user info to slice")
                    dispatch(setUser(user_data)); // Sending data to redux slice
                    console.log("Sending user info to database, user info: ", user_data)
                    userAPI.updateUser(user_data.id, user_data); // Sending data to database

                    // Sending a 'reminder' for all other users to update the public key of this user
                    socket.emit('changePublicKey', { userId: user_data.id, publicKey: user_data.public_key });

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
                    <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Login;
