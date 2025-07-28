import { logoutUser, registerUser } from '../controllers/authController.js';
import { loginUser } from '../controllers/authController.js';
import { addProduct, getProducts } from '../controllers/productController.js';

export default async function routes(fastify, opts) {
    fastify.post('/api/register', registerUser);
    fastify.post('/api/login', loginUser);
    fastify.post('/api/logout', logoutUser);
    fastify.post('/api/products', addProduct);
    fastify.get('/api/products', getProducts);
}
