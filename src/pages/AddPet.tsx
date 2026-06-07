import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { useAppStore } from '@/store';
import type { Pet } from '@/types';

export default function AddPet() {
  const navigate = useNavigate();
  const { addPet } = useAppStore();
  const [form, setForm] = useState({
    name: '',
    type: 'dog' as 'dog' | 'cat' | 'other',
    breed: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    weight: '',
    personality: '',
  });

  const handleSubmit = () => {
    const newPet: Pet = {
      id: Date.now().toString(),
      userId: '1',
      name: form.name,
      type: form.type,
      breed: form.breed,
      age: parseInt(form.age) || 0,
      gender: form.gender,
      weight: parseFloat(form.weight) || 0,
      personality: form.personality,
      avatar: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20${form.type}%20pet%20portrait&image_size=square`,
      vaccineRecords: [],
      medicalHistory: [],
    };
    addPet(newPet);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold">添加宠物档案</h2>
      </div>

      <div className="p-4">
        <div className="card p-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera size={32} className="text-gray-400" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                +
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">宠物名称 *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="请输入宠物名称"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">宠物类型 *</label>
              <div className="flex gap-3">
                {[
                  { value: 'dog', label: '狗狗' },
                  { value: 'cat', label: '猫咪' },
                  { value: 'other', label: '其他' },
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setForm({ ...form, type: type.value as any })}
                    className={`flex-1 py-2 rounded-lg border text-sm transition-colors ${
                      form.type === type.value
                        ? 'border-primary-500 bg-primary-50 text-primary-500'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">品种 *</label>
              <input
                type="text"
                value={form.breed}
                onChange={e => setForm({ ...form, breed: e.target.value })}
                placeholder="请输入品种"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">年龄（岁）</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">体重（kg）</label>
                <input
                  type="number"
                  value={form.weight}
                  onChange={e => setForm({ ...form, weight: e.target.value })}
                  placeholder="0"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setForm({ ...form, gender: 'male' })}
                  className={`flex-1 py-2 rounded-lg border text-sm transition-colors ${
                    form.gender === 'male'
                      ? 'border-blue-500 bg-blue-50 text-blue-500'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  公 ♂
                </button>
                <button
                  onClick={() => setForm({ ...form, gender: 'female' })}
                  className={`flex-1 py-2 rounded-lg border text-sm transition-colors ${
                    form.gender === 'female'
                      ? 'border-pink-500 bg-pink-50 text-pink-500'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  母 ♀
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">性格描述</label>
              <textarea
                value={form.personality}
                onChange={e => setForm({ ...form, personality: e.target.value })}
                placeholder="描述一下宠物的性格特点..."
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.name || !form.breed}
          className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          保存档案
        </button>
      </div>
    </div>
  );
}
