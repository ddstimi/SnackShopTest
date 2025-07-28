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

   const { authenticated, isAdmin } = await validateUserCredentials(username, password);

  if (!authenticated) {
    return reply.code(401).send({ authenticated: false });
  }
  console.log('Setting cookie for:', username);
    reply.setCookie('username', username, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 24,
        signed: true,
    });
  console.log('cookie set for:', username);


  return reply.code(200).send({
    authenticated: true,
    isAdmin: isAdmin,
  });
}

export async function logoutUser(reply) {
 reply.clearCookie('username', {
  path: '/', 
  signed: true
});
  return reply.code(200).send({ message: 'Logged out successfully.' });
}
