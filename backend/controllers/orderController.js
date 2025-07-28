import { getAllOrders, placeOrderService } from '../services/orderService.js';
import { requireAuth, requireAdmin } from '../utils/auth.js';

export async function placeOrder(request, reply) {
  if (!requireAuth(request, reply)) return;

  const user = request.user;
  const cart = request.body.cart;

  if (!Array.isArray(cart) || cart.length === 0) {
    return reply.code(400).send({ error: 'Cart is empty or invalid.' });
  }

  try {
    const result = await placeOrderService(user.id, cart);
    return reply.code(201).send({ message: 'Order placed: '+ {result}, orderId: result.orderId });
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
}



export async function getOrders(request, reply) {
if (!requireAdmin(request, reply)) return;
   try {
    const result = await getAllOrders();
    if(!result || result.length === 0){
        return reply.code(204).send({ error: 'There are no products to show.' });
      }else{
        return reply.code(200).send(result);
      }  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
}
