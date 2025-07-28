import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import routes from './routes/routes.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: true, credentials: true });
await fastify.register(cookie);

await fastify.register(routes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server: ${address}`);
});
