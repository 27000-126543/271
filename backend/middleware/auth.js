import jwt from 'jsonwebtoken';
import { get } from '../database/db.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '未登录，请先登录' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await get('SELECT id, username, phone, avatar, level, points, annual_spending, activity_score, address, city FROM users WHERE id = ?', [decoded.userId]);
    
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: '登录已过期，请重新登录' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.id === 1)) {
    next();
  } else {
    res.status(403).json({ message: '需要管理员权限' });
  }
};
