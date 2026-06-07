import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Calendar, Syringe, Heart, ShoppingBag, Users } from 'lucide-react';
import { useAppStore } from '@/store';
import { api } from '@/api/client';
import dayjs from 'dayjs';

export default function Home() {
  const navigate = useNavigate();
  const { user, pets, loadPets } = useAppStore();
  const [vaccinePlans, setVaccinePlans] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadPets();
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansRes, eventsRes] = await Promise.all([
        api.services.getVaccinePlans().catch(() => ({ plans: [] })),
        api.social.getEvents().catch(() => ({ events: [] })),
      ]);
      setVaccinePlans(plansRes.plans || []);
      setEvents(eventsRes.events || []);
    } catch (e) {
      console.error('加载首页数据失败:', e);
    }
  };

  const upcomingPlans = vaccinePlans.filter(p => p.status === 'pending').slice(0, 3);
  const nearbyEvents = events.slice(0, 2);

  const quickActions = [
    { icon: Syringe, label: '疫苗提醒', color: 'bg-pet-blue', path: '/profile' },
    { icon: Calendar, label: '服务预约', color: 'bg-pet-green', path: '/services' },
    { icon: ShoppingBag, label: '宠物商城', color: 'bg-pet-orange', path: '/mall' },
    { icon: Users, label: '宠物社交', color: 'bg-pet-pink', path: '/social' },
  ];

  const getLevelText = (level: string) => {
    const levelMap: Record<string, string> = {
      normal: '普通',
      silver: '银卡',
      gold: '金卡',
      diamond: '钻石',
    };
    return levelMap[level] || '普通';
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-4 pt-12 pb-20 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm opacity-90">欢迎回来，{user?.username}</p>
            <p className="text-lg font-semibold mt-1">今天想为毛孩子做什么？</p>
          </div>
          <Bell size={24} className="cursor-pointer" />
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索服务、商品、活动..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/95 text-gray-800 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="px-4 -mt-12">
        <div className="card p-4 grid grid-cols-4 gap-4 animate-slide-up">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center"
            >
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2`}>
                <action.icon size={24} />
              </div>
              <span className="text-xs text-gray-600">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 card p-4 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">我的宠物</h3>
            <button
              onClick={() => navigate('/profile/pet/add')}
              className="text-primary-500 text-sm"
            >
              + 添加
            </button>
          </div>
          {pets.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {pets.map(pet => (
                <div
                  key={pet.id}
                  onClick={() => navigate(`/profile/pet/${pet.id}`)}
                  className="flex-shrink-0 flex flex-col items-center cursor-pointer"
                >
                  <img
                    src={pet.avatar}
                    alt={pet.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
                  />
                  <span className="text-sm mt-2 text-gray-700">{pet.name}</span>
                  <span className="text-xs text-gray-400">{pet.breed}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-4 text-sm">还没有添加宠物，点击右上角添加吧</p>
          )}
        </div>

        {upcomingPlans.length > 0 && (
          <div className="mt-6 card p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">健康提醒</h3>
              <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full">
                {upcomingPlans.length}项待办
              </span>
            </div>
            <div className="space-y-3">
              {upcomingPlans.map(plan => {
                const pet = pets.find(p => p.id === plan.petId);
                return (
                  <div key={plan.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Syringe size={18} className="text-primary-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{plan.name}</p>
                      <p className="text-xs text-gray-500">
                        {pet?.name || '未知'} · {dayjs(plan.recommendedDate).format('MM月DD日')}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/services')}
                      className="text-xs bg-primary-500 text-white px-3 py-1.5 rounded-full"
                    >
                      预约
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {nearbyEvents.length > 0 && (
          <div className="mt-6 card p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">附近活动</h3>
              <button
                onClick={() => navigate('/social')}
                className="text-primary-500 text-sm"
              >
                查看全部
              </button>
            </div>
            <div className="space-y-4">
              {nearbyEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/social/event/${event.id}`)}
                  className="flex gap-3 cursor-pointer"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {dayjs(event.date).format('MM月DD日 HH:mm')}
                    </p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-primary-500">
                        {event.participants}/{event.maxParticipants}人报名
                      </span>
                      <span className="text-xs text-orange-500">+{event.pointsReward}积分</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 mb-6 card p-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white">
                <Heart size={24} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">会员中心</p>
                <p className="text-xs text-gray-500">
                  当前{getLevelText(user?.level || 'normal')}会员，享专属权益
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/membership')}
              className="text-sm text-primary-500"
            >
              查看详情 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
