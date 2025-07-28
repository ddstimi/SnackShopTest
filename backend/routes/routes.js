import { logoutUser, registerUser, loginUser } from '../controllers/authController.js';
import { placeOrder } from '../controllers/orderController.js';
import { addProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController.js';

export default async function routes(fastify, opts) {
    fastify.post('/api/register', registerUser);
    fastify.post('/api/login', loginUser);
    fastify.post('/api/logout', logoutUser);
    fastify.post('/api/products', addProduct);
    fastify.get('/api/products', getProducts);
    fastify.put('/api/products/:id', updateProduct);
    fastify.delete('/api/products/:id', deleteProduct);
    fastify.post('/api/order', placeOrder);
}
