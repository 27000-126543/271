import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, Video } from 'lucide-react';
import { useAppStore } from '@/store';
import dayjs from 'dayjs';

export default function FosterDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { serviceOrders, pets } = useAppStore();
  
  const order = serviceOrders.find(o => o.id === orderId);
  const pet = pets.find(p => p.id === order?.petId);

  if (!order) {
    return <div className="p-4">订单不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold">寄养详情</h2>
      </div>

      <div className="p-4">
        <div className="card p-4 mb-4">
          <div className="flex items-center gap-4">
            {pet && (
              <img
                src={pet.avatar}
                alt={pet.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-gray-800">{order.serviceName}</h3>
              <p className="text-sm text-gray-500 mt-1">
                预约时间：{order.appointmentTime}
              </p>
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                进行中
              </span>
            </div>
          </div>
        </div>

        <div className="card p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">每日动态</h3>
          {order.dailyUpdates && order.dailyUpdates.length > 0 ? (
            <div className="space-y-6">
              {order.dailyUpdates.map((update, index) => (
              <div key={update.id} className="relative pl-6 pb-6">
                {index < order.dailyUpdates!.length - 1 && (
                  <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gray-200" />
                )}
                <div className="absolute left-0 top-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-800">
                    {dayjs(update.date).format('MM月DD日')}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{update.description}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {update.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          alt=""
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      </div>
                    ))}
                    {update.videos?.map((_, i) => (
                      <div
                        key={`video-${i}`}
                        className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center"
                      >
                        <Video size={24} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">暂无动态更新</p>
          )}
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-gray-800 mb-4">订单信息</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">订单编号</span>
              <span className="text-gray-800">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">下单时间</span>
              <span className="text-gray-800">{order.createTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">订单金额</span>
              <span className="text-primary-500 font-medium">¥{order.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
