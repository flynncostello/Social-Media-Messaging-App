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

            if (data.success) {
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

                dispatch(setUser(user_data));
                userAPI.updateUser(user_data.id, user_data);

                navigate(ROUTES.dashboard(user_data.id));
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
