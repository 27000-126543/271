import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Check } from 'lucide-react';
import { mockServiceProviders } from '@/data/mock';
import { useAppStore } from '@/store';
import dayjs from 'dayjs';

export default function ServiceBooking() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { pets, addServiceOrder } = useAppStore();
  const provider = mockServiceProviders.find(p => p.id === providerId);
  
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState('09:00');

  if (!provider) {
    return <div className="p-4">服务商不存在</div>;
  }

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleBooking = () => {
    if (!selectedService || !selectedPet) return;
    
    const service = provider.services.find(s => s.id === selectedService);
    if (!service) return;

    const newOrder = {
      id: Date.now().toString(),
      userId: '1',
      petId: selectedPet,
      providerId: provider.id,
      serviceId: service.id,
      serviceName: service.name,
      status: 'confirmed' as const,
      appointmentTime: `${selectedDate} ${selectedTime}`,
      createTime: new Date().toISOString(),
      price: service.price,
    };
    addServiceOrder(newOrder);
    alert('预约成功！');
    navigate('/services');
  };

  const selectedServiceData = provider.services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold">预约服务</h2>
      </div>

      <div className="p-4">
        <div className="card p-4 mb-4">
          <div className="flex gap-4">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{provider.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <MapPin size={14} />
                <span>{provider.distance}km</span>
                <span>·</span>
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span>{provider.rating}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{provider.address}</p>
            </div>
          </div>
        </div>

        <div className="card p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">选择服务项目</h3>
          <div className="space-y-3">
            {provider.services.map(service => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedService === service.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{service.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Clock size={12} />
                      <span>{service.duration}分钟</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-500">¥{service.price}</p>
                    {selectedService === service.id && (
                      <Check size={18} className="text-primary-500 ml-auto" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">选择宠物</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {pets.map(pet => (
              <div
                key={pet.id}
                onClick={() => setSelectedPet(pet.id)}
                className={`flex-shrink-0 flex flex-col items-center cursor-pointer p-2 rounded-lg transition-colors ${
                  selectedPet === pet.id ? 'bg-primary-50 ring-2 ring-primary-500' : 'bg-gray-50'
                }`}
              >
                <img
                  src={pet.avatar}
                  alt={pet.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="text-xs mt-2 text-gray-700">{pet.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">选择日期</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = dayjs().add(i + 1, 'day');
              const dateStr = date.format('YYYY-MM-DD');
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`flex-shrink-0 w-14 py-3 rounded-lg text-center transition-colors ${
                    selectedDate === dateStr
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  <p className="text-xs">{date.format('MM/DD')}</p>
                  <p className="text-xs mt-1">{['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.day()]}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">选择时间</h3>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-2 rounded-lg text-sm transition-colors ${
                  selectedTime === time
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-gray-100 p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">合计</p>
            <p className="text-xl font-bold text-primary-500">
              ¥{selectedServiceData?.price || 0}
            </p>
          </div>
          <button
            onClick={handleBooking}
            disabled={!selectedService || !selectedPet}
            className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            确认预约
          </button>
        </div>
      </div>
    </div>
  );
}
