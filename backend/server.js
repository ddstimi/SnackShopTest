import Fastify from 'fastify';
import cors from '@fastify/cors';
import routes from './routes/routes.js';
import { registerAuth } from './utils/auth.js';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fastifyCors from 'fastify-cors';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
await registerAuth(fastify);

await fastify.register(routes);

fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), 'assets'),
  prefix: '/assets/',
});


fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server: ${address}`);
});
