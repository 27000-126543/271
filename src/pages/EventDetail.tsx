import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Clock, QrCode, Gift } from 'lucide-react';
import { mockEvents } from '@/data/mock';
import dayjs from 'dayjs';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find(e => e.id === id);
  const [isJoined, setIsJoined] = useState(event?.isJoined || false);
  const [showQr, setShowQr] = useState(false);

  if (!event) {
    return <div className="p-4">活动不存在</div>;
  }

  const handleJoin = () => {
    if (isJoined) {
      setShowQr(true);
    } else {
      setIsJoined(true);
      alert('报名成功！获得 ' + event.pointsReward + ' 积分');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold">活动详情</h2>
      </div>

      <img
        src={event.image}
        alt={event.title}
        className="w-full h-56 object-cover"
      />

      <div className="bg-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded">
            {event.type === 'party' ? '聚会' : event.type === 'competition' ? '比赛' : event.type === 'training' ? '训练' : '领养'}
          </span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">{event.title}</h1>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar size={18} className="text-primary-500" />
            <span>{dayjs(event.date).format('YYYY年MM月DD日 HH:mm')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin size={18} className="text-primary-500" />
            <div>
              <p>{event.location}</p>
              <p className="text-gray-400">{event.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Users size={18} className="text-primary-500" />
            <span>已报名 {event.participants}/{event.maxParticipants} 人</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Gift size={18} className="text-orange-500" />
            <span className="text-orange-500">参与奖励 +{event.pointsReward} 积分</span>
          </div>
        </div>
      </div>

      <div className="bg-white mt-3 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">活动介绍</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-gray-100 p-4">
        <button
          onClick={handleJoin}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isJoined
              ? 'bg-green-500 text-white'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          {isJoined ? '出示签到码' : '立即报名'}
        </button>
      </div>

      {showQr && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowQr(false)}>
          <div className="bg-white p-6 rounded-2xl mx-8" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-center mb-4">签到码</h3>
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <QrCode size={120} className="text-gray-800" />
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              请在活动现场出示此二维码签到
            </p>
            <button
              onClick={() => setShowQr(false)}
              className="w-full mt-4 btn-secondary"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
