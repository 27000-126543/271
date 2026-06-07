import express from 'express';
import { run, get, all } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/providers', async (req, res) => {
  try {
    const { city = '北京' } = req.query;
    let providers = await all(
      'SELECT * FROM service_providers WHERE city = ? OR ? = "all"',
      [city, city]
    );

    for (const provider of providers) {
      provider.services = await all(
        'SELECT * FROM service_items WHERE provider_id = ?',
        [provider.id]
      );
    }

    providers = providers.sort((a, b) => {
      const scoreA = a.rating * 100 - a.distance * 10 - (a.busy_level === 'high' ? 20 : a.busy_level === 'medium' ? 10 : 0);
      const scoreB = b.rating * 100 - b.distance * 10 - (b.busy_level === 'high' ? 20 : b.busy_level === 'medium' ? 10 : 0);
      return scoreB - scoreA;
    });

    res.json({ providers });
  } catch (error) {
    res.status(500).json({ message: '获取服务商列表失败' });
  }
});

router.get('/providers/:id', async (req, res) => {
  try {
    const provider = await get('SELECT * FROM service_providers WHERE id = ?', [req.params.id]);
    if (!provider) {
      return res.status(404).json({ message: '服务商不存在' });
    }
    provider.services = await all('SELECT * FROM service_items WHERE provider_id = ?', [req.params.id]);
    res.json({ provider });
  } catch (error) {
    res.status(500).json({ message: '获取服务商详情失败' });
  }
});

router.use(authMiddleware);

router.get('/orders', async (req, res) => {
  try {
    const orders = await all(
      'SELECT so.*, sp.name as provider_name, sp.avatar as provider_avatar, p.name as pet_name, p.avatar as pet_avatar FROM service_orders so LEFT JOIN service_providers sp ON so.provider_id = sp.id LEFT JOIN pets p ON so.pet_id = p.id WHERE so.user_id = ? ORDER BY so.created_at DESC',
      [req.user.id]
    );

    for (const order of orders) {
      order.dailyUpdates = await all(
        'SELECT * FROM daily_updates WHERE order_id = ? ORDER BY date DESC',
        [order.id]
      );
      for (const update of order.dailyUpdates) {
        update.images = JSON.parse(update.images || '[]');
        update.videos = JSON.parse(update.videos || '[]');
      }
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: '获取订单列表失败' });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await get(
      'SELECT so.*, sp.name as provider_name, sp.avatar as provider_avatar, sp.address as provider_address, p.name as pet_name, p.avatar as pet_avatar FROM service_orders so LEFT JOIN service_providers sp ON so.provider_id = sp.id LEFT JOIN pets p ON so.pet_id = p.id WHERE so.id = ? AND so.user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }

    order.dailyUpdates = await all(
      'SELECT * FROM daily_updates WHERE order_id = ? ORDER BY date DESC',
      [req.params.id]
    );
    for (const update of order.dailyUpdates) {
      update.images = JSON.parse(update.images || '[]');
      update.videos = JSON.parse(update.videos || '[]');
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: '获取订单详情失败' });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const { petId, providerId, serviceId, serviceName, appointmentTime, price } = req.body;

    if (!petId || !providerId || !serviceId || !appointmentTime || !price) {
      return res.status(400).json({ message: '请填写完整信息' });
    }

    const result = await run(
      `INSERT INTO service_orders (user_id, pet_id, provider_id, service_id, service_name, status, appointment_time, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, petId, providerId, serviceId, serviceName, 'confirmed', appointmentTime, price]
    );

    await run(
      'UPDATE users SET annual_spending = annual_spending + ?, points = points + ?, activity_score = MIN(100, activity_score + 2) WHERE id = ?',
      [price, Math.floor(price / 10), req.user.id]
    );

    res.json({ message: '预约成功', orderId: result.lastID });
  } catch (error) {
    res.status(500).json({ message: '预约失败' });
  }
});

router.post('/orders/:id/cancel', async (req, res) => {
  try {
    const order = await get('SELECT id, status FROM service_orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ message: '该订单状态无法取消' });
    }

    await run('UPDATE service_orders SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
    res.json({ message: '订单已取消' });
  } catch (error) {
    res.status(500).json({ message: '取消失败' });
  }
});

router.get('/vaccine-plans', async (req, res) => {
  try {
    const pets = await all('SELECT id, name, type, breed, age FROM pets WHERE user_id = ?', [req.user.id]);
    const plans = [];

    for (const pet of pets) {
      const baseDate = new Date();
      
      if (pet.type === 'dog') {
        plans.push({
          id: `vax-${pet.id}-1`,
          petId: pet.id,
          petName: pet.name,
          name: '体内驱虫',
          type: 'deworming',
          recommendedDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: '建议每3个月进行一次体内驱虫'
        });
        plans.push({
          id: `vax-${pet.id}-2`,
          petId: pet.id,
          petName: pet.name,
          name: '年度体检',
          type: 'checkup',
          recommendedDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: '建议每年进行一次全面体检'
        });
      } else if (pet.type === 'cat') {
        plans.push({
          id: `vax-${pet.id}-3`,
          petId: pet.id,
          petName: pet.name,
          name: '体外驱虫',
          type: 'deworming',
          recommendedDate: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: '建议每月进行一次体外驱虫'
        });
      }
    }

    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: '获取疫苗计划失败' });
  }
});

export default router;
