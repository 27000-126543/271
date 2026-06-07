import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Gift, Percent, Clock, Heart, Headphones, Cake, ChevronRight, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store';
import { api } from '@/api/client';
import type { MemberBenefit } from '@/types';

const levelConfig = {
  normal: { name: '普通会员', minSpending: 0, color: 'from-gray-400 to-gray-500', nextLevel: 'silver' },
  silver: { name: '银卡会员', minSpending: 1000, color: 'from-gray-300 to-gray-400', nextLevel: 'gold' },
  gold: { name: '金卡会员', minSpending: 5000, color: 'from-yellow-400 to-yellow-600', nextLevel: 'diamond' },
  diamond: { name: '钻石会员', minSpending: 20000, color: 'from-blue-400 to-blue-600', nextLevel: null },
};

const iconMap: Record<string, any> = {
  Gift,
  Percent,
  Bath: Heart,
  Clock,
  Heart,
  Headphones,
  Cake,
};

export default function Membership() {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [benefits, setBenefits] = useState<MemberBenefit[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentLevel = user?.level || 'normal';
  const config = levelConfig[currentLevel as keyof typeof levelConfig];
  const nextConfig = config.nextLevel ? levelConfig[config.nextLevel as keyof typeof levelConfig] : null;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [benefitsRes, progressRes] = await Promise.all([
          api.membership.getBenefits(),
          api.membership.getProgress().catch(() => null)
        ]);
        setBenefits(benefitsRes.benefits || benefitsRes.data || []);
        setProgress(progressRes?.progress || progressRes?.data || null);
      } catch (e: any) {
        setError(e.message || '加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const annualSpending = progress?.annualSpending ?? user?.annualSpending ?? 0;
  const progressPercent = nextConfig 
    ? Math.min(100, (annualSpending / nextConfig.minSpending) * 100)
    : 100;

  const benefitsByLevel = {
    normal: benefits.filter(b => b.level === 'normal'),
    silver: benefits.filter(b => b.level === 'silver'),
    gold: benefits.filter(b => b.level === 'gold'),
    diamond: benefits.filter(b => b.level === 'diamond'),
  };

  const unlockedLevels = ['normal'];
  if (currentLevel === 'silver' || currentLevel === 'gold' || currentLevel === 'diamond') unlockedLevels.push('silver');
  if (currentLevel === 'gold' || currentLevel === 'diamond') unlockedLevels.push('gold');
  if (currentLevel === 'diamond') unlockedLevels.push('diamond');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-gray-500 text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold">会员中心</h2>
      </div>

      <div className={`bg-gradient-to-br ${config.color} p-6 text-white`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Crown size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold">{config.name}</h3>
            <p className="text-sm opacity-90 mt-1">积分：{user?.points}</p>
          </div>
        </div>

        {nextConfig && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>距离{nextConfig.name}</span>
              <span>¥{annualSpending} / ¥{nextConfig.minSpending}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs mt-2 opacity-90">
              再消费 ¥{Math.max(0, nextConfig.minSpending - annualSpending)} 即可升级
            </p>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="card p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">当前权益</h3>
          <div className="grid grid-cols-4 gap-4">
            {benefitsByLevel[currentLevel as keyof typeof benefitsByLevel].map(benefit => {
              const IconComponent = iconMap[benefit.icon] || Gift;
              return (
                <div key={benefit.id} className="text-center">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl mx-auto flex items-center justify-center">
                    <IconComponent size={20} className="text-primary-500" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{benefit.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">全部等级权益</h3>
          </div>
          {(['normal', 'silver', 'gold', 'diamond'] as const).map(level => {
            const levelData = levelConfig[level];
            const isUnlocked = unlockedLevels.includes(level);
            return (
              <div key={level} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown size={18} className={isUnlocked ? 'text-yellow-500' : 'text-gray-300'} />
                    <span className={`font-medium ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                      {levelData.name}
                    </span>
                    {level !== 'normal' && (
                      <span className="text-xs text-gray-400">年消费¥{levelData.minSpending}</span>
                    )}
                  </div>
                  {currentLevel === level && (
                    <span className="text-xs bg-primary-100 text-primary-500 px-2 py-0.5 rounded-full">
                      当前
                    </span>
                  )}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {benefitsByLevel[level].map(benefit => (
                    <span
                      key={benefit.id}
                      className={`text-xs px-2 py-1 rounded ${
                        isUnlocked
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {benefit.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="card p-4 mt-4 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">升级攻略</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">多消费多积分</p>
                <p className="text-xs text-gray-500 mt-1">每消费1元获得1积分，积分可兑换权益</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">参与社区活动</p>
                <p className="text-xs text-gray-500 mt-1">报名参加活动可获得额外活跃度积分</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Gift size={16} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">邀请好友注册</p>
                <p className="text-xs text-gray-500 mt-1">每邀请一位好友获得200积分奖励</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
