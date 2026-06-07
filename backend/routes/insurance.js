import express from 'express';
import { run, get, all } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/plans', async (req, res) => {
  try {
    const plans = await all('SELECT * FROM insurance_plans');
    for (const plan of plans) {
      plan.features = JSON.parse(plan.features || '[]');
    }
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: '获取保险产品失败' });
  }
});

router.use(authMiddleware);

router.get('/claims', async (req, res) => {
  try {
    const claims = await all(
      'SELECT ic.*, p.name as pet_name FROM insurance_claims ic LEFT JOIN pets p ON ic.pet_id = p.id WHERE ic.user_id = ? ORDER BY ic.created_at DESC',
      [req.user.id]
    );
    for (const claim of claims) {
      claim.images = JSON.parse(claim.images || '[]');
    }
    res.json({ claims });
  } catch (error) {
    res.status(500).json({ message: '获取理赔记录失败' });
  }
});

router.post('/claims', async (req, res) => {
  try {
    const { petId, planId, planName, amount, description, images = [] } = req.body;

    if (!petId || !planId || !planName || !amount || !description) {
      return res.status(400).json({ message: '请填写完整信息' });
    }

    await run(
      `INSERT INTO insurance_claims (user_id, pet_id, plan_id, plan_name, status, amount, description, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, petId, planId, planName, 'pending', amount, description, JSON.stringify(images)]
    );

    await run(
      'UPDATE users SET activity_score = MIN(100, activity_score + 3) WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: '理赔申请已提交，系统将自动初审' });
  } catch (error) {
    res.status(500).json({ message: '提交失败' });
  }
});

router.get('/claims/:id', async (req, res) => {
  try {
    const claim = await get(
      'SELECT ic.*, p.name as pet_name FROM insurance_claims ic LEFT JOIN pets p ON ic.pet_id = p.id WHERE ic.id = ? AND ic.user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!claim) {
      return res.status(404).json({ message: '理赔记录不存在' });
    }
    claim.images = JSON.parse(claim.images || '[]');
    res.json({ claim });
  } catch (error) {
    res.status(500).json({ message: '获取理赔详情失败' });
  }
});

export default router;
