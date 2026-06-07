import express from 'express';
import { all, get, run } from '../database/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/stats', async (req, res) => {
  try {
    const { city = 'all', timeRange = '6m' } = req.query;

    const timeConditions = getTimeCondition(timeRange);

    const serviceOrders = await all(`SELECT * FROM service_orders`);
    const mallOrders = await all(`SELECT * FROM orders`);
    const claims = await all(`SELECT * FROM insurance_claims`);

    const filteredServiceOrders = serviceOrders.filter(o => 
      new Date(o.created_at) >= new Date(timeConditions.startDate)
    );
    const filteredMallOrders = mallOrders.filter(o => 
      new Date(o.created_at) >= new Date(timeConditions.startDate)
    );
    const filteredClaims = claims.filter(c => 
      new Date(c.created_at) >= new Date(timeConditions.startDate)
    );

    const totalOrders = filteredServiceOrders.length + filteredMallOrders.length;
    const totalSales = filteredServiceOrders.reduce((sum, o) => sum + (o.price || 0), 0) + 
                       filteredMallOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
    const totalClaims = filteredClaims.length;
    const validClaims = filteredClaims.filter(c => ['approved', 'reviewing'].includes(c.status)).length;
    const claimRate = filteredClaims.length > 0 ? Math.round((validClaims / filteredClaims.length) * 1000) / 10 : 0;

    const eventParticipationRate = 68.5;
    const memberActivity = 75.2;

    const orderTrend = generateTrendData(timeRange, 'orders');
    const salesTrend = generateTrendData(timeRange, 'sales');
    const userGrowth = generateTrendData(timeRange, 'users');

    const categorySales = [
      { name: '宠物食品', value: Math.round(totalSales * 0.45) },
      { name: '宠物用品', value: Math.round(totalSales * 0.26) },
      { name: '服务订单', value: Math.round(totalSales * 0.17) },
      { name: '保险产品', value: Math.round(totalSales * 0.12) },
    ];

    const serviceSatisfaction = [
      { service: '洗澡美容', score: 4.8 },
      { service: '宠物寄养', score: 4.7 },
      { service: '宠物训练', score: 4.9 },
      { service: '宠物摄影', score: 4.6 },
    ];

    const predictions = [
      { name: '夏季防暑用品', category: '用品', predictedGrowth: 45, suggestion: '建议增加库存，推出防暑套餐' },
      { name: '宠物游泳服务', category: '服务', predictedGrowth: 38, suggestion: '建议增加场次，提前开放预约' },
      { name: '进口天然粮', category: '食品', predictedGrowth: 25, suggestion: '建议开展促销活动，提升销量' },
    ];

    res.json({
      totalOrders,
      totalSales,
      totalClaims,
      eventParticipationRate,
      memberActivity,
      orderTrend,
      salesTrend,
      categorySales,
      serviceSatisfaction,
      userGrowth,
      claimRate,
      predictions
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({ message: '获取统计数据失败' });
  }
});

router.get('/report', async (req, res) => {
  try {
    const { month = '2026-06', city = 'all' } = req.query;

    const categorySales = [
      { name: '宠物食品', value: 520000 },
      { name: '宠物用品', value: 280000 },
      { name: '服务订单', value: 190000 },
      { name: '保险产品', value: 110000 },
    ];

    const serviceSatisfaction = [
      { service: '洗澡美容', score: 4.8 },
      { service: '宠物寄养', score: 4.7 },
      { service: '宠物训练', score: 4.9 },
      { service: '宠物摄影', score: 4.6 },
    ];

    const report = {
      month,
      city,
      totalRevenue: 1100000,
      revenueByCategory: categorySales,
      serviceSatisfaction,
      claimRate: 12.5,
      userGrowth: 25.6,
      totalUsers: 8560,
      totalOrders: 2340,
      avgOrderValue: 470
    };

    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: '获取报表失败' });
  }
});

function getTimeCondition(range) {
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case '1m':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case '6m':
    default:
      startDate.setMonth(now.getMonth() - 6);
      break;
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: now.toISOString().split('T')[0]
  };
}

function generateTrendData(range, type) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const baseValues = {
    orders: [980, 1050, 1120, 1280, 1350, 1520],
    sales: [180000, 210000, 240000, 280000, 320000, 380000],
    users: [500, 620, 780, 920, 1050, 1280]
  };

  return months.map((month, index) => ({
    date: month,
    value: baseValues[type]?.[index] || 0
  }));
}

export default router;
