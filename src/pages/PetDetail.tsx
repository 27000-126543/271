import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Syringe, FileText, Edit3 } from 'lucide-react';
import { useAppStore } from '@/store';
import dayjs from 'dayjs';

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets } = useAppStore();
  const pet = pets.find(p => p.id === id);

  if (!pet) {
    return (
      <div className="p-4 text-center">
        <p>宠物不存在</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary-500">返回</button>
      </div>
    );
  }

  const tabs = [
    { id: 'vaccine', label: '疫苗记录', icon: Syringe },
    { id: 'medical', label: '病史档案', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 h-48">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => navigate(-1)} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <button className="text-white">
              <Edit3 size={24} />
            </button>
          </div>
        </div>
        <div className="px-4 -mt-16">
          <div className="card p-4 animate-slide-up">
            <div className="flex items-center gap-4">
              <img
                src={pet.avatar}
                alt={pet.name}
                className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-md"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{pet.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{pet.breed}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>{pet.age}岁</span>
                  <span>{pet.gender === 'male' ? '♂' : '♀'}</span>
                  <span>{pet.weight}kg</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">性格：</span>{pet.personality}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="card overflow-hidden">
          <div className="flex border-b border-gray-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className="flex-1 py-4 text-center text-sm font-medium text-gray-600 border-b-2 border-primary-500 text-primary-500"
              >
                <tab.icon size={16} className="inline mr-1" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">疫苗记录</h3>
            {pet.vaccineRecords.length > 0 ? (
              <div className="space-y-3">
                {pet.vaccineRecords.map(record => (
                  <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{record.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{record.hospital}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        已完成
                      </span>
                    </div>
                    <div className="flex justify-between mt-3 text-sm">
                      <span className="text-gray-500">
                        接种日期：{dayjs(record.date).format('YYYY-MM-DD')}
                      </span>
                      <span className="text-primary-500">
                        下次：{dayjs(record.nextDate).format('YYYY-MM-DD')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">暂无疫苗记录</p>
            )}

            <h3 className="font-semibold text-gray-800 mt-6 mb-4">病史档案</h3>
            {pet.medicalHistory.length > 0 ? (
              <div className="space-y-3">
                {pet.medicalHistory.map(record => (
                  <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{record.diagnosis}</p>
                        <p className="text-sm text-gray-500 mt-1">{record.hospital}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {dayjs(record.date).format('YYYY-MM-DD')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">治疗方案：</span>{record.treatment}
                    </p>
                    {record.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">备注：</span>{record.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">暂无病史记录</p>
            )}
          </div>
        </div>

        <button className="w-full mt-6 mb-8 btn-primary">
          添加疫苗/体检记录
        </button>
      </div>
    </div>
  );
}
