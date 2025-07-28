import { registerUser } from '../controllers/authController.js';
import { loginUser } from '../controllers/authController.js';
import { addProduct } from '../controllers/productController.js';

export default async function routes(fastify, opts) {
    fastify.post('/api/register', registerUser);
    fastify.post('/api/login', loginUser);
    fastify.post('/api/products', addProduct);

}
