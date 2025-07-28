import { registerUser } from '../controllers/authController.js';
import { loginUser } from '../controllers/authController.js';

export default async function authRoutes(fastify, opts) {
    fastify.post('/api/register', registerUser);
    fastify.post('/api/login', loginUser);
}
