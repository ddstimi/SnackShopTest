import { createUser, getUserByUsername, validateUserCredentials } from '../services/userService.js';

export async function registerUser(request, reply) {
  const { username, password } = request.body;

  if (!username || !password) {
    return reply.code(400).send({ error: 'Username and password are required.' });
  }

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return reply.code(409).send({ error: 'Username already exists.' });
  }

  const success = await createUser(username, password);
  if (success) {
    return reply.code(201).send({ message: 'User registered successfully.' });
  } else {
    return reply.code(500).send({ error: 'Could not create user.' });
  }
}

export async function loginUser(request, reply) {
  const { username, password } = request.body;

  if (!username || !password) {
    return reply.code(400).send({ error: 'Username and password are required.' });
  }
const valid = await validateUserCredentials(username, password);
  if (!valid) {
    return reply.code(401).send({ error: 'Invalid credentials.' });
  }

  return reply.code(200).send({ message: 'Login successful.' });
}
