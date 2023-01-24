import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

// Convert scrypt to an async function
const scryptAsync = promisify(scrypt);

/** Class to manage password hashing and verification*/
export class Password {
    /** Hash a password using scrypt, return the hashed password and the used salt */
    static async hashPassword(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buffer = await scryptAsync(password, salt, 64) as Buffer;
        return `${buffer.toString('hex')}.${salt}`
    }

    /** Compare given password with the given hashed password with salt*/
    static async comparePassword(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buffer = await scryptAsync(suppliedPassword, salt, 64) as Buffer;
        return hashedPassword === buffer.toString('hex');

    }
}