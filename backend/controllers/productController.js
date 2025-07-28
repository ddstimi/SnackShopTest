import { createProduct, getAllProduct, getProductById, getProductByName, updateProductById } from '../services/productService.js';
import { requireAdmin } from '../utils/auth.js';

export async function missingProductData(name, price,stock) {
  if (!name || price == null || stock == null) {
    return reply.code(400).send({ error: 'Missing product data.' });
  }
}


export async function addProduct(request, reply) {
  const { name, price, stock } = request.body;

  const isAdmin = await requireAdmin(request, reply);
  if (!isAdmin) {
    return reply.code(403).send({ error: 'Only admin can add products.' });
  }

  missingProductData(name,price,stock);

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

export async function updateProduct(request, reply) {
  if (!requireAdmin(request, reply)) {
    return reply.code(403).send({ error: 'Only admin can update products.' });
  }

  const { id } = request.params;
  const { name, price, stock } = request.body;

  missingProductData(name,price,stock);


  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    return reply.code(404).send({ error: 'Product not found.' });
  }

  if (name !== existingProduct.name) {
    const productWithSameName = await getProductByName(name);
    if (productWithSameName) {
      return reply.code(409).send({ error: 'Product name already exists.' });
    }
  }

  const success = await updateProductById(id, name, price, stock);

  if (success) {
    return reply.code(200).send({ message: 'Product updated successfully.' });
  } else {
    return reply.code(500).send({ error: 'Failed to update product.' });
  }
}