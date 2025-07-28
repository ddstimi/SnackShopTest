import bcrypt from 'bcrypt';
import db from '../db/db.js';

export async function getUserByUsername(username) {
  return await db.get('SELECT * FROM users WHERE username = ?', [username]);
}

export async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    return true;
  } catch (err) {
    console.error('Error creating user:', err);
    return false;
  }
}

export async function validateUserCredentials(username, password) {
  const user = await getUserByUsername(username);
  if (!user) return false;

  const match = await bcrypt.compare(password, user.password);
  return {
    authenticated: match,
    isAdmin: match && username === 'admin',
  };
}
