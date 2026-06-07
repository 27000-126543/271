import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Clock, CheckCircle, XCircle, Upload, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/api/client';
import { useAppStore } from '@/store';
import type { InsurancePlan, InsuranceClaim } from '@/types';

const statusText: Record<string, string> = {
  pending: '待审核',
  reviewing: '审核中',
  approved: '已通过',
  rejected: '已拒绝'
};

const statusColor: Record<string, string> = {
  pending: 'text-yellow-500 bg-yellow-50',
  reviewing: 'text-blue-500 bg-blue-50',
  approved: 'text-green-500 bg-green-50',
  rejected: 'text-red-500 bg-red-50'
};

export default function Insurance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'plans' | 'claims'>('plans');
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimForm, setClaimForm] = useState({
    petId: '1',
    description: '',
    amount: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (activeTab === 'plans') {
          const res = await api.insurance.getPlans();
          setPlans(res.plans || res.data || []);
        } else {
          const res = await api.insurance.getClaims().catch(() => ({ claims: [] }));
          setClaims(res.claims || res.data || []);
        }
      } catch (e: any) {
        setError(e.message || '加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeTab]);

  const handleSubmitClaim = async () => {
    try {
      await api.insurance.createClaim({
        petId: claimForm.petId,
        description: claimForm.description,
        amount: parseFloat(claimForm.amount) || 0,
      });
      setShowClaimForm(false);
      setClaimForm({ petId: '1', description: '', amount: '' });
      alert('理赔申请已提交，系统将自动初审');
      const res = await api.insurance.getClaims().catch(() => ({ claims: [] }));
      setClaims(res.claims || res.data || []);
    } catch (e: any) {
      alert(e.message || '提交失败');
    }
  };

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
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold">宠物保险</h2>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <Shield size={32} />
          <div>
            <h3 className="text-xl font-bold">给毛孩子全方位保障</h3>
            <p className="text-sm opacity-90 mt-1">意外+医疗，最高赔付8万</p>
          </div>
        </div>
      </div>

      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('plans')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'plans'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500'
            }`}
          >
            保险产品
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'claims'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500'
            }`}
          >
            理赔记录
          </button>
        </div>
      </div>

      {activeTab === 'plans' ? (
        <div className="p-4 space-y-4 pb-8">
          {plans.map(plan => (
            <div key={plan.id} className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-500">¥{plan.price}</p>
                  <p className="text-xs text-gray-400">/{plan.duration}天</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  最高保额 <span className="text-primary-500 font-medium">¥{plan.coverage.toLocaleString()}</span>
                </span>
                <button className="btn-primary text-sm">立即投保</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 pb-8">
          <button
            onClick={() => setShowClaimForm(true)}
            className="w-full mb-4 btn-primary flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            申请理赔
          </button>
          
          <div className="space-y-4">
            {claims.map(claim => (
              <div key={claim.id} className="card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{claim.planName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{claim.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[claim.status]}`}>
                    {statusText[claim.status]}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <Clock size={14} className="inline mr-1" />
                    {claim.createTime}
                  </div>
                  <div className="text-lg font-bold text-primary-500">
                    ¥{claim.amount}
                  </div>
                </div>
                {claim.reviewNotes && (
                  <p className="text-xs text-gray-500 mt-2">{claim.reviewNotes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showClaimForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setShowClaimForm(false)}>
          <div className="bg-white w-full max-w-[430px] mx-auto rounded-t-2xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">申请理赔</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">理赔说明</label>
                <textarea
                  value={claimForm.description}
                  onChange={e => setClaimForm({ ...claimForm, description: e.target.value })}
                  placeholder="请描述理赔原因..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">理赔金额（元）</label>
                <input
                  type="number"
                  value={claimForm.amount}
                  onChange={e => setClaimForm({ ...claimForm, amount: e.target.value })}
                  placeholder="请输入金额"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">上传凭证</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">点击上传病历、发票等资料</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClaimForm(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitClaim}
                  className="flex-1 btn-primary"
                >
                  提交申请
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
