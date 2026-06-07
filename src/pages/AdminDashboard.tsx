import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, TrendingUp, ShoppingCart, Shield, Users, Activity,
  Calendar, MapPin, Download, BarChart3, PieChart, Lightbulb, Loader2, AlertCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '@/api/client';
import type { DashboardStats } from '@/types';

const COLORS = ['#ee7712', '#4A90D9', '#5CB85C', '#FF6B9D', '#9B59B6'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTime, setSelectedTime] = useState('6m');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.admin.getStats(selectedCity, selectedTime);
        setStats(res.stats || res.data || null);
      } catch (e: any) {
        setError(e.message || '加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [selectedCity, selectedTime]);

  const exportReport = () => {
    if (!stats) return;
    const report = {
      month: '2026年6月',
      totalRevenue: stats.totalSales,
      revenueByCategory: stats.categorySales,
      serviceSatisfaction: stats.serviceSatisfaction,
      claimRate: stats.claimRate,
      userGrowth: stats.userGrowth[stats.userGrowth.length - 1].value,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '月度运营报表.json';
    a.click();
    URL.revokeObjectURL(url);
    alert('报表已导出！');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-gray-500 text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-800 font-medium mb-2">加载失败</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary text-sm"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold">管理看板</h2>
        </div>
        <button
          onClick={exportReport}
          className="flex items-center gap-1 text-sm text-primary-500"
        >
          <Download size={16} />
          导出报表
        </button>
      </div>

      <div className="bg-white px-4 py-3 border-b border-gray-200 flex gap-4">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">全部城市</option>
            <option value="beijing">北京</option>
            <option value="shanghai">上海</option>
            <option value="guangzhou">广州</option>
            <option value="shenzhen">深圳</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <select
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="1m">近1个月</option>
            <option value="3m">近3个月</option>
            <option value="6m">近6个月</option>
            <option value="1y">近1年</option>
          </select>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <ShoppingCart size={16} className="text-primary-500" />
              <span>服务订单量</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.totalOrders.toLocaleString()}</p>
            <p className="text-xs text-green-500 mt-1">↑ 12.5% 较上月</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <TrendingUp size={16} className="text-green-500" />
              <span>商城销售额</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">¥{(stats.totalSales / 10000).toFixed(1)}万</p>
            <p className="text-xs text-green-500 mt-1">↑ 18.3% 较上月</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <Shield size={16} className="text-blue-500" />
              <span>保险理赔量</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.totalClaims}</p>
            <p className="text-xs text-gray-500 mt-1">赔付率 {stats.claimRate}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <Users size={16} className="text-purple-500" />
              <span>会员活跃度</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats.memberActivity}%</p>
            <p className="text-xs text-green-500 mt-1">↑ 5.2% 较上月</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary-500" />
              订单与销售趋势
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.orderTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="订单量"
                  stroke="#ee7712"
                  strokeWidth={2}
                  dot={{ fill: '#ee7712' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <PieChart size={18} className="text-primary-500" />
            品类营收占比
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={stats.categorySales}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categorySales.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `¥${(value / 10000).toFixed(1)}万`} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Activity size={18} className="text-primary-500" />
            服务满意度
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.serviceSatisfaction} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="service" tick={{ fontSize: 12 }} width={70} />
                <Tooltip />
                <Bar dataKey="score" fill="#4A90D9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Users size={18} className="text-primary-500" />
            用户增长趋势
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#5CB85C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 shadow-sm mb-8 border border-yellow-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Lightbulb size={18} className="text-yellow-500" />
            智能预测与建议
          </h3>
          <div className="space-y-3">
            {stats.predictions.map((pred, index) => (
              <div key={index} className="bg-white rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{pred.name}</span>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                    预计增长 +{pred.predictedGrowth}%
                  </span>
                </div>
                <p className="text-sm text-gray-500">{pred.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
