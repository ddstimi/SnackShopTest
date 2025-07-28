import db from '../db/db.js';

export async function getProductByName(name) {
  return await db.get('SELECT * FROM products WHERE name = ?', [name]);
}

export async function createProduct(name, price, stock) {
  try {
    const existing = await getProductByName(name);
    if (existing) {
      return { success: false, reason: 'exists' };
    }

    await db.run(
      `INSERT INTO products (name, price, stock) VALUES (?, ?, ?)`,
      [name, price, stock]
    );

    return { success: true };
  } catch (err) {
    console.error('Error creating product:', err);
    return { success: false, reason: 'error' };
  }
}

export async function getAllProduct() {
  return await db.all('SELECT * FROM products');
}

export async function getProductById(id) {
  return await db.get('SELECT * FROM products WHERE id = ?', [id]);
}

export async function updateProductById(id, name, price, stock) {
  try {
    await db.run(
      'UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?',
      [name, price, stock, id]
    );
    return true;
  } catch (err) {
    console.error('Failed to update product:', err);
    return false;
  }
}

export async function deleteProductById(id) {
  try {
    await db.run('DELETE FROM products WHERE id = ?', [id]);
    return { success: true };
  } catch (err) {
    console.error('Failed to delete product:', err);
    return { success: false, error: err };
  }
}