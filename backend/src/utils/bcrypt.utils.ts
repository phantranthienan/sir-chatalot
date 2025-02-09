import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;


/**
 * Hashes a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password stored in DB
 * @returns Boolean - true if match, false otherwise
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};