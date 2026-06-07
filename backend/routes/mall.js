import express from 'express';
import { run, get, all } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', async (req, res) => {
  try {
    const { category = 'all', search = '' } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    const products = await all(sql, params);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: '获取商品列表失败' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ message: '商品不存在' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: '获取商品详情失败' });
  }
});

router.use(authMiddleware);

router.get('/orders', async (req, res) => {
  try {
    const orders = await all(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    for (const order of orders) {
      order.items = await all(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: '获取订单列表失败' });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: '请选择商品' });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await get('SELECT id, name, price, image, stock FROM products WHERE id = ?', [item.productId]);
      if (!product) {
        return res.status(400).json({ message: `商品不存在: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `${product.name} 库存不足` });
      }
      totalPrice += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.image
      });
    }

    const result = await run(
      `INSERT INTO orders (user_id, total_price, status, address, logistics_status, current_location) VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, totalPrice, 'paid', address || req.user.address, 'shipped', '配送中']
    );

    for (const item of orderItems) {
      await run(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, image) VALUES (?, ?, ?, ?, ?, ?)`,
        [result.lastID, item.productId, item.productName, item.quantity, item.price, item.image]
      );
      await run(
        'UPDATE products SET stock = stock - ?, sales = sales + ? WHERE id = ?',
        [item.quantity, item.quantity, item.productId]
      );
    }

    await run(
      'UPDATE users SET annual_spending = annual_spending + ?, points = points + ?, activity_score = MIN(100, activity_score + 1) WHERE id = ?',
      [totalPrice, Math.floor(totalPrice / 10), req.user.id]
    );

    res.json({ message: '下单成功', orderId: result.lastID });
  } catch (error) {
    console.error('下单错误:', error);
    res.status(500).json({ message: '下单失败' });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await get(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    order.items = await all(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.id]
    );
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: '获取订单详情失败' });
  }
});

export default router;
