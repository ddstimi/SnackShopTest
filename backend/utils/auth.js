import fastifyCookie from '@fastify/cookie';
import { getUserByUsername } from '../services/userService.js';

export function registerAuth(fastify) {
  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'supersecret',
    parseOptions: {},
  });

  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request, reply) => {
        const raw = request.cookies?.username;
    const { valid, value: username } = request.unsignCookie(raw || '');

    if (valid && username) {
      const user = await getUserByUsername(username);
      if (user) {
        request.user = {
          id: user.id,
          username: user.username,
          isAdmin: user.username === 'admin'
        };
      }
    }
  });
}

export function requireAuth(request, reply) {
  if (!request.user) {
    reply.code(401).send({ error: 'Not authenticated.' });
    return false;
  }
  return true;
}

export function requireAdmin(request, reply) {
  return request.user?.isAdmin === true;
}

