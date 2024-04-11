import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js';

// Encrypting message with shared key, takes in chatroom_id and message, then looks at `${chatroom_id}_shared_secret` in localStorage
export const encryptMessageWithSharedKey = async (chatroom_id, message) => {
    const sharedSecret = localStorage.getItem(`${chatroom_id}_shared_secret`);
    if (!sharedSecret) {
      throw new Error('Shared secret not found in localStorage');
    }
  
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const key = CryptoJS.enc.Base64.parse(sharedSecret);
  
    const messageWordArray = CryptoJS.lib.WordArray.create(messageData);
    const encryptedData = CryptoJS.AES.encrypt(messageWordArray, key, { iv: CryptoJS.lib.WordArray.create(iv) }).ciphertext.toString(CryptoJS.enc.Base64);
    const encryptedMessage = `${Buffer.from(iv).toString('hex')}:${encryptedData}`;
  
    return encryptedMessage;
  };



// Decrypting message with shared key, takes in chatroom_id and encrypted message, then looks at `${chatroom_id}_shared_secret` in localStorage
export const decryptMessageWithSharedKey = async (chatroom_id, encryptedMessage) => {
    const sharedSecret = localStorage.getItem(`${chatroom_id}_shared_secret`);
    if (!sharedSecret) {
      throw new Error('Shared secret not found in localStorage');
    }
  
    console.log('Shared secret:', sharedSecret);
    console.log('Encrypted message:', encryptedMessage);
  
    const key = CryptoJS.enc.Base64.parse(sharedSecret);
  
    // Extract the IV and the ciphertext from the encrypted message
    const ivLength = 16 * 2; // 16 bytes, each byte represented by 2 hex characters
    const ivHex = encryptedMessage.slice(0, ivLength);
    const ciphertextBase64 = encryptedMessage.slice(ivLength + 1);
  
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const ciphertext = CryptoJS.enc.Base64.parse(ciphertextBase64);
  
    const decryptedDataWordArray = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, { iv: iv });
    const decryptedMessage = CryptoJS.enc.Utf8.stringify(decryptedDataWordArray);
  
    console.log('Decrypted message:', decryptedMessage);
  
    return decryptedMessage;
  };


// Encrypting with receiver's public key
export const encryptWithReceiversPublicKey = async (message, friendsPublicKey) => {
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);
    //console.log('a')
    console.log('Friends public key: ', friendsPublicKey)
    console.log(typeof friendsPublicKey);

    const importedPublicKey = await crypto.subtle.importKey(
        'spki',
        Buffer.from(friendsPublicKey, 'base64'),
        {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
        },
        true,
        ['encrypt']
    );
    //console.log('b')

    const encryptedData = await crypto.subtle.encrypt(
        {
        name: 'RSA-OAEP'
        },
        importedPublicKey,
        messageData
    );
    //console.log('c')

    const encryptedMessage = Buffer.from(new Uint8Array(encryptedData)).toString('hex');
    //console.log('d');
    return encryptedMessage;
};

// Decrypts incoming message over socket using private key
export const decryptWithPrivateKey = async (encryptedMessage, user_id) => {
    const privateKeyData = localStorage.getItem(`${user_id}_private_key`);

    if (!privateKeyData) {
        throw new Error('Private key not found in localStorage');
    }

    const importedPrivateKey = await crypto.subtle.importKey(
        'pkcs8',
        Buffer.from(privateKeyData, 'base64'),
        {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
        },
        true,
        ['decrypt']
    );

    const encryptedData = Buffer.from(encryptedMessage, 'hex');

    const decryptedData = await crypto.subtle.decrypt(
        {
        name: 'RSA-OAEP'
        },
        importedPrivateKey,
        encryptedData
    );

    const decoder = new TextDecoder();
    const decryptedMessage = decoder.decode(new Uint8Array(decryptedData));

    return decryptedMessage;
}; 

// Encrypts message using the user's password derviced encryption key
export const encryptMessageWithUsersPassword = async (message, user_id) => {
    const encryptionKeyStr = localStorage.getItem(`${user_id}_message_encryption_key`);
    const encryptionKey = await crypto.subtle.importKey(
        'raw',
        Buffer.from(encryptionKeyStr, 'hex'),
        { name: 'AES-CBC', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    const messageData = encoder.encode(message);

    const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: iv },
        encryptionKey,
        messageData
    );

    const encryptedMessage = `${Buffer.from(iv).toString('hex')}:${Buffer.from(new Uint8Array(encryptedData)).toString('hex')}`;
    return encryptedMessage;
};

// Decrypts message using the user's password-derived encryption key
export const decryptMessageWithUsersPassword = async (encryptedMessage, user_id) => {
    const encryptionKeyStr = localStorage.getItem(`${user_id}_message_encryption_key`);
    //console.log("1")
    if (!encryptionKeyStr) {
        throw new Error('User encryption key not found in localStorage');
    }
    //console.log("2")

    const encryptionKey = await crypto.subtle.importKey(
        'raw',
        Buffer.from(encryptionKeyStr, 'hex'),
        { name: 'AES-CBC', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
    //console.log("3")

    const [ivHex, encryptedDataHex] = encryptedMessage.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedData = Buffer.from(encryptedDataHex, 'hex');
    //console.log("4")

    const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: iv },
        encryptionKey,
        encryptedData
    );
    //console.log("5")

    const decoder = new TextDecoder();
    const decryptedMessage = decoder.decode(new Uint8Array(decryptedData));
    console.log("IN DECRYPT WITH USERS PASSWORD FUNC, DECRYPTED PASSWORD: ", decryptedMessage, "\n")

    return decryptedMessage;
};

// Function for generating HMAC
export const generateHMAC = (encrypted_message, chatroom_id) => {
    const sharedSecret = localStorage.getItem(`${chatroom_id}_shared_secret`);
    const hmac = CryptoJS.HmacSHA256(encrypted_message, sharedSecret);
    return hmac.toString(CryptoJS.enc.Base64);
};

// Function to check HMAC is correct
export const validateHmac = (encrypted_message, hmac, chatroom_id) => {
    const sharedSecret = localStorage.getItem(`${chatroom_id}_shared_secret`);
    const expectedHmac = generateHMAC(encrypted_message, chatroom_id);
    return hmac === expectedHmac;
};
