import { createProduct, getAllProduct } from '../services/productService.js';
import { requireAdmin } from '../utils/auth.js';

export async function addProduct(request, reply) {
  const { name, price, stock } = request.body;

  const isAdmin = await requireAdmin(request, reply);
  if (!isAdmin) {
    return reply.code(403).send({ error: 'Only admin can add products.' });
  }

  if (!name || price == null || stock == null) {
    return reply.code(400).send({ error: 'Missing product data.' });
  }

  const result = await createProduct(name, price, stock);

  if (result.success) {
    return reply.code(201).send({ message: 'Product created successfully.' });
  } else if (result.reason === 'exists') {
    return reply.code(409).send({ error: 'Product with this name already exists.' });
  } else {
    return reply.code(500).send({ error: 'Failed to create product.' });
  }
}

export async function getProducts(reply) {
      const results = await getAllProduct();

      if(!results || results.length === 0){
        return reply.code(204).send({ error: 'There are no products to show.' });
      }else{
        return reply.code(200).send(results);
      }

}
