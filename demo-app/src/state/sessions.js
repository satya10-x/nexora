import crypto from 'crypto';

export const COOKIE_NAME = 'shopease_session';

// In-memory active session tokens Set
const activeSessions = new Set();

/**
 * Creates and stores a new random session token.
 * @returns {string}
 */
export const createSession = () => {
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.add(token);
  return token;
};

/**
 * Validates whether the given session token exists and is active.
 * @param {string} token
 * @returns {boolean}
 */
export const isValidSession = (token) => {
  if (!token || typeof token !== 'string') return false;
  return activeSessions.has(token);
};

/**
 * Destroys/removes an active session token.
 * @param {string} token
 * @returns {boolean}
 */
export const destroySession = (token) => {
  if (!token) return false;
  return activeSessions.delete(token);
};

export default {
  COOKIE_NAME,
  createSession,
  isValidSession,
  destroySession,
};

