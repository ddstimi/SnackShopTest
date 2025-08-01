import db from '../db/db.js';

export async function placeOrderService(userId, cart) {
  let totalPrice = 0;

  await db.run('BEGIN');

  try {
    for (const item of cart) {
      const product = await db.get('SELECT * FROM products WHERE id = ?', item.id);
      if (!product) throw new Error(`Product ID ${item.id} does not exist.`);
      if (product.stock < item.quantity) {
        throw new Error(`Nincs elég mennyiség ebből a termékből: ${product.name}`);
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
        items: await Promise.all(cart.map(async item => {
            const product = await db.get('SELECT name, price FROM products WHERE id = ?', item.id);
            return {
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                total: item.quantity * product.price
            };
        }))
    };

  } catch (err) {
    await db.run('ROLLBACK');
    throw err;
  }
}

export async function getAllOrders() {
  try {
    const orders = await db.all(`
      SELECT 
        o.id as orderId,
        o.user_id as userId,
        u.username,
        o.total_price as totalPrice,
        o.created_at as createdAt,
        oi.product_id as productId,
        p.name as productName,
        p.image as productImage,
        oi.quantity,
        oi.price_at_purchase as price
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      ORDER BY o.created_at DESC
    `);
    
    const orderMap = new Map();
    
    orders.forEach(row => {
      if (!orderMap.has(row.orderId)) {
        orderMap.set(row.orderId, {
          orderId: row.orderId,
          userId: row.userId,
          username: row.username || 'Guest',
          totalPrice: row.totalPrice,
          createdAt: row.createdAt,
          items: []
        });
      }
      
      if (row.productId) {
        orderMap.get(row.orderId).items.push({
          productId: row.productId,
          name: row.productName || 'Unknown Product',
          image: row.productImage || '/default.png',
          quantity: row.quantity,
          price: row.price
        });
      }
    });
    
    return Array.from(orderMap.values());
  } catch (err) {
    console.error('Database error:', err);
    throw new Error('Failed to fetch orders from database');
  }
}