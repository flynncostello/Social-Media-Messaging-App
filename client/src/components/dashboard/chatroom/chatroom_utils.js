import { Buffer } from 'buffer';

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
export const decryptWithPrivateKey = async (encryptedMessage) => {
    const privateKeyData = localStorage.getItem('private_key');

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
export const encryptMessageWithUsersPassword = async (message) => {
    const encryptionKeyStr = localStorage.getItem('userEncryptionKey');
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
export const decryptMessageWithUsersPassword = async (encryptedMessage) => {
    const encryptionKeyStr = localStorage.getItem('userEncryptionKey');
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