import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Scissors, Home, Camera, GraduationCap, Bath, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/api/client';
import type { ServiceProvider, ServiceOrder } from '@/types';

const serviceCategories = [
  { id: 'bath', icon: Bath, label: '洗澡美容', color: 'bg-pet-blue' },
  { id: 'foster', icon: Home, label: '宠物寄养', color: 'bg-pet-green' },
  { id: 'training', icon: GraduationCap, label: '宠物训练', color: 'bg-pet-orange' },
  { id: 'photo', icon: Camera, label: '宠物摄影', color: 'bg-pet-pink' },
];

const busyLevelText: Record<string, string> = {
  low: '空闲',
  medium: '适中',
  high: '繁忙'
};

const busyLevelColor: Record<string, string> = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500'
};

export default function Services() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [providersRes, ordersRes] = await Promise.all([
          api.services.getProviders(),
          api.services.getOrders().catch(() => ({ orders: [] }))
        ]);
        setProviders(providersRes.providers || providersRes.data || []);
        setOrders(ordersRes.orders || ordersRes.data || []);
      } catch (e: any) {
        setError(e.message || '加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProviders = providers.filter(p => {
    if (searchText && !p.name.includes(searchText)) return false;
    return true;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    const scoreA = a.rating * 100 - a.distance * 10 - (a.busyLevel === 'high' ? 20 : a.busyLevel === 'medium' ? 10 : 0);
    const scoreB = b.rating * 100 - b.distance * 10 - (b.busyLevel === 'high' ? 20 : b.busyLevel === 'medium' ? 10 : 0);
    return scoreB - scoreA;
  });

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
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 pt-12 pb-6">
        <h2 className="text-xl font-semibold mb-4">服务预约</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="搜索服务商或服务项目"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/95 text-gray-800 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="px-4 -mt-2">
        <div className="card p-4 animate-slide-up">
          <div className="grid grid-cols-4 gap-3">
            {serviceCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className="flex flex-col items-center"
              >
                <div className={`${cat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2 ${
                  activeCategory === cat.id ? 'ring-2 ring-offset-2 ring-primary-500' : ''
                }`}>
                  <cat.icon size={24} />
                </div>
                <span className="text-xs text-gray-600">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-800 mb-3">智能推荐</h3>
          <p className="text-xs text-gray-500 mb-4">根据距离、评价、繁忙度综合排序</p>
        </div>

        <div className="space-y-4 pb-8">
          {sortedProviders.map((provider, index) => (
            <div
              key={provider.id}
              className="card p-4 animate-slide-up cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/services/book/${provider.id}`)}
            >
              {index === 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full">
                    最优推荐
                  </span>
                </div>
              )}
              <div className="flex gap-4">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800">{provider.name}</h4>
                    <span className={`text-xs ${busyLevelColor[provider.busyLevel]}`}>
                      {busyLevelText[provider.busyLevel]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span>{provider.distance}km</span>
                    <span>·</span>
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span>{provider.rating}</span>
                    <span>({provider.reviewCount})</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{provider.address}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                {provider.services.slice(0, 3).map(service => (
                  <span key={service.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {service.name} ¥{service.price}
                </span>
              ))}
            </div>
            </div>
          ))}
        </div>

        {orders.length > 0 && (
          <div className="mt-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">进行中的服务</h3>
            {orders.map(order => (
              <div
                key={order.id}
                onClick={() => navigate(`/services/foster/${order.id}`)}
                className="card p-4 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{order.serviceName}</p>
                    <p className="text-sm text-gray-500 mt-1">预约时间：{order.appointmentTime}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    进行中
                  </span>
                </div>
                {order.dailyUpdates && order.dailyUpdates.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">最新动态 ({order.dailyUpdates.length}条更新)</p>
                    <div className="flex gap-2 mt-2">
                      {order.dailyUpdates.slice(-1)[0].images.map((img, i) => (
                        <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
