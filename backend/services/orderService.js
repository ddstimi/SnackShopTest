import db from '../db/db.js';

export async function placeOrderService(userId, cart) {
  let totalPrice = 0;

  await db.run('BEGIN');

  try {
    for (const item of cart) {
      const product = await db.get('SELECT * FROM products WHERE id = ?', item.id);
      if (!product) throw new Error(`Product ID ${item.id} does not exist.`);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      totalPrice += product.price * item.quantity;
    }

    const orderResult = await db.run(
      'INSERT INTO orders (user_id, total_price, created_at) VALUES (?, ?, DATETIME("now", "+2 hours"))',
      [userId, totalPrice]
    );
    const orderId = orderResult.lastID;

    for (const item of cart) {
      const product = await db.get('SELECT * FROM products WHERE id = ?', item.id);

      await db.run(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, product.price]
      );

      await db.run(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }

    const user = await db.get('SELECT username FROM users WHERE id = ?', userId);
        const date = await db.get('SELECT created_at FROM orders WHERE id = ?',orderId);

    console.log('\x1b[35m Vásárló: '+user.username+'\x1b[0m');
    console.log('\x1b[35m Tételek:\x1b[0m');
    for (const item of cart) {
    const product = await db.get('SELECT name, price FROM products WHERE id = ?', item.id);
    if (product) {
        console.log(`\x1b[35m - ${item.quantity} x ${product.name} ~ ${product.price} Ft = ${item.quantity * product.price} Ft\x1b[0m`);
    }
    }
    console.log(`\x1b[35m Végösszeg: ${totalPrice} Ft \x1b[0m`);
    console.log('\x1b[35m Vásárlás időpontja: '+date.created_at+'\x1b[0m');


    await db.run('COMMIT');

    return {
  orderId,
  orderedBy: user?.username || 'unknown',
  total: totalPrice,
  items: cart.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    total: item.quantity * item.price
  }))
};

  } catch (err) {
    await db.run('ROLLBACK');
    throw err;
  }
}


export async function getAllOrders() {
  return await db.all('SELECT * FROM orders');
}