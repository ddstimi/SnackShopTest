import fastifyCookie from '@fastify/cookie';

export function registerAuth(fastify) {
  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'supersecret',
    parseOptions: {},
  });

 fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request, reply) => {
    const signedUsername = request.cookies.username;

    if (signedUsername) {
      const { value, valid } = fastify.unsignCookie(signedUsername);
      if (valid) {
        request.user = {
          username: value,
          isAdmin: value === 'admin',
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

