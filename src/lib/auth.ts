import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a PIN or password
 */
export async function hashCredential(credential: string): Promise<string> {
  return bcrypt.hash(credential, SALT_ROUNDS);
}

/**
 * Verifies a PIN or password against its hash
 */
export async function verifyCredential(
  credential: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(credential, hash);
}

/**
 * Validates PIN format (4 or 6 digits)
 */
export function isValidPin(pin: string): boolean {
  return /^\d{4}$|^\d{6}$/.test(pin);
}

/**
 * Validates password format (minimum 8 characters)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}
