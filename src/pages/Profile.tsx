import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Settings, Heart, Shield, Gift, ShoppingBag, FileText, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store';
import { api } from '@/api/client';

export default function Profile() {
  const navigate = useNavigate();
  const { user, pets } = useAppStore();
  const [orderCount, setOrderCount] = useState(0);
  const [couponCount, setCouponCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const levelNames: Record<string, string> = {
    normal: '普通会员',
    silver: '银卡会员',
    gold: '金卡会员',
    diamond: '钻石会员'
  };

  const levelColors: Record<string, string> = {
    normal: 'bg-gray-500',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-500',
    diamond: 'bg-blue-500'
  };

  const menuItems = [
    { icon: Heart, label: '宠物档案', path: '#', badge: `${pets.length}只` },
    { icon: Shield, label: '宠物保险', path: '/insurance' },
    { icon: Gift, label: '会员中心', path: '/membership' },
    { icon: ShoppingBag, label: '我的订单', path: '/mall' },
    { icon: FileText, label: '服务记录', path: '/services' },
    { icon: BarChart3, label: '管理后台', path: '/admin' },
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const [mallOrders, serviceOrders] = await Promise.all([
          api.mall.getOrders().catch(() => ({ orders: [] })),
          api.services.getOrders().catch(() => ({ orders: [] }))
        ]);
        const mallCount = mallOrders.orders?.length || mallOrders.data?.length || 0;
        const serviceCount = serviceOrders.orders?.length || serviceOrders.data?.length || 0;
        setOrderCount(mallCount + serviceCount);
      } catch (e: any) {
        setError(e.message || '加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-gray-500 text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 pt-12 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">个人中心</h2>
          <Settings size={24} className="cursor-pointer" />
        </div>
        
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar}
            alt="头像"
            className="w-16 h-16 rounded-full border-2 border-white/30 object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{user?.username}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${levelColors[user?.level || 'normal']} text-white`}>
                {levelNames[user?.level || 'normal']}
              </span>
              <span className="text-sm opacity-90">{user?.points}积分</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-16">
        <div className="card p-4 animate-slide-up">
          <div className="grid grid-cols-4 text-center">
            <div>
              <p className="text-xl font-bold text-gray-800">{pets.length}</p>
              <p className="text-xs text-gray-500 mt-1">宠物</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{orderCount}</p>
              <p className="text-xs text-gray-500 mt-1">订单</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{user?.points}</p>
              <p className="text-xs text-gray-500 mt-1">积分</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{couponCount}</p>
              <p className="text-xs text-gray-500 mt-1">优惠券</p>
            </div>
          </div>
        </div>

        <div className="mt-6 card animate-slide-up">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">我的宠物</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {pets.map(pet => (
                <div
                  key={pet.id}
                  onClick={() => navigate(`/profile/pet/${pet.id}`)}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={pet.avatar}
                    alt={pet.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{pet.name}</p>
                    <p className="text-xs text-gray-500">{pet.breed} · {pet.age}岁</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/profile/pet/add')}
              className="w-full mt-4 py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 text-sm hover:border-primary-300 hover:text-primary-500 transition-colors"
            >
              + 添加宠物档案
            </button>
          </div>
        </div>

        <div className="mt-6 card mb-8 animate-slide-up">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="text-primary-500" />
                <span className="text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-xs text-gray-500">{item.badge}</span>
                )}
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
