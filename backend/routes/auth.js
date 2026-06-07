import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { run, get } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const calculateLevel = (annualSpending) => {
  if (annualSpending >= 20000) return 'diamond';
  if (annualSpending >= 5000) return 'gold';
  if (annualSpending >= 1000) return 'silver';
  return 'normal';
};

router.post('/register', async (req, res) => {
  try {
    const { username, phone, password, city = '北京' } = req.body;

    if (!username || !phone || !password) {
      return res.status(400).json({ message: '请填写完整信息' });
    }

    const existingUser = await get('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existingUser) {
      return res.status(400).json({ message: '该手机号已注册' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await run(
      `INSERT INTO users (username, phone, password, city, points) VALUES (?, ?, ?, ?, ?)`,
      [username, phone, hashedPassword, city, 100]
    );

    const user = await get(
      'SELECT id, username, phone, avatar, level, points, annual_spending, activity_score, address, city FROM users WHERE id = ?',
      [result.lastID]
    );

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({
      message: '注册成功，赠送100积分！',
      token,
      user
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '注册失败', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: '请输入手机号和密码' });
    }

    const user = await get('SELECT * FROM users WHERE phone = ?', [phone]);
    if (!user) {
      return res.status(400).json({ message: '手机号或密码错误' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '手机号或密码错误' });
    }

    const level = calculateLevel(user.annual_spending);
    if (level !== user.level) {
      await run('UPDATE users SET level = ? WHERE id = ?', [level, user.id]);
      user.level = level;
    }

    delete user.password;

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({
      message: '登录成功',
      token,
      user
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '登录失败', error: error.message });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const level = calculateLevel(req.user.annual_spending);
    if (level !== req.user.level) {
      await run('UPDATE users SET level = ? WHERE id = ?', [level, req.user.id]);
      req.user.level = level;
    }

    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, avatar, address, city } = req.body;
    
    await run(
      `UPDATE users SET username = COALESCE(?, username), avatar = COALESCE(?, avatar), address = COALESCE(?, address), city = COALESCE(?, city), updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [username, avatar, address, city, req.user.id]
    );

    const user = await get(
      'SELECT id, username, phone, avatar, level, points, annual_spending, activity_score, address, city FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: '更新成功', user });
  } catch (error) {
    res.status(500).json({ message: '更新失败' });
  }
});

export default router;
