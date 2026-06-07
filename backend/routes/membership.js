import express from 'express';
import { all, get } from '../database/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/benefits', async (req, res) => {
  try {
    const benefits = await all('SELECT * FROM member_benefits ORDER BY level, id');
    res.json({ benefits });
  } catch (error) {
    res.status(500).json({ message: '获取会员权益失败' });
  }
});

router.use(authMiddleware);

router.get('/progress', async (req, res) => {
  try {
    const levels = [
      { level: 'normal', name: '普通会员', minSpending: 0 },
      { level: 'silver', name: '银卡会员', minSpending: 1000 },
      { level: 'gold', name: '金卡会员', minSpending: 5000 },
      { level: 'diamond', name: '钻石会员', minSpending: 20000 },
    ];

    const currentLevelIndex = levels.findIndex(l => l.level === req.user.level);
    const currentLevel = levels[currentLevelIndex];
    const nextLevel = levels[currentLevelIndex + 1];

    let progress = 100;
    let remaining = 0;
    if (nextLevel) {
      progress = Math.min(100, Math.floor((req.user.annual_spending / nextLevel.minSpending) * 100));
      remaining = Math.max(0, nextLevel.minSpending - req.user.annual_spending);
    }

    res.json({
      currentLevel: {
        ...currentLevel,
        points: req.user.points,
        activityScore: req.user.activity_score,
        annualSpending: req.user.annual_spending
      },
      nextLevel,
      progress,
      remaining
    });
  } catch (error) {
    res.status(500).json({ message: '获取会员进度失败' });
  }
});

export default router;
