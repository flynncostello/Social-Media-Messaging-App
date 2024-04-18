import { Buffer } from 'buffer';

// Used to derive an encryption key from the password - this encryption key is used for symmetric encryption of messages (personal copy)
// Simply stored it in localStorage under user_password_encryption_key
export const derivePasswordEncryptionKey = async (password, user_id) => {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    const salt = new TextEncoder().encode('S0m3C0mpl3xStr1ng'); // constant salt

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
    return encryptionKeyStr;
};

