import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import petRoutes from './routes/pets.js';
import serviceRoutes from './routes/services.js';
import mallRoutes from './routes/mall.js';
import insuranceRoutes from './routes/insurance.js';
import socialRoutes from './routes/social.js';
import membershipRoutes from './routes/membership.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '宠物生活服务平台API运行正常' });
});

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/mall', mallRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ message: '服务器内部错误', error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 服务器已启动`);
  console.log(`📍 接口地址: http://localhost:${PORT}/api`);
  console.log(`📊 健康检查: http://localhost:${PORT}/api/health\n`);
});
