import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Plus, MapPin, Calendar, Users } from 'lucide-react';
import { mockPosts, mockEvents } from '@/data/mock';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export default function Social() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'feed' | 'events'>('feed');
  const [posts, setPosts] = useState(mockPosts);

  const handleLike = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">宠物社区</h2>
          <button className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex gap-6 mt-4">
          <button
            onClick={() => setActiveTab('feed')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'feed'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500'
            }`}
          >
            动态广场
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'events'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500'
            }`}
          >
            附近活动
          </button>
        </div>
      </div>

      {activeTab === 'feed' ? (
        <div className="p-4 space-y-4 pb-8">
          {posts.map(post => (
            <div key={post.id} className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={post.userAvatar}
                  alt={post.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{post.username}</p>
                  <p className="text-xs text-gray-400">{dayjs(post.createTime).fromNow()}</p>
                </div>
                <Share2 size={18} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-700 mb-3">{post.content}</p>
              {post.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {post.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1 text-sm"
                >
                  <Heart
                    size={18}
                    className={post.isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                  />
                  <span className={post.isLiked ? 'text-red-500' : 'text-gray-500'}>
                    {post.likes}
                  </span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-500">
                  <MessageCircle size={18} />
                  <span>{post.comments}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 space-y-4 pb-8">
          {mockEvents.map(event => (
            <div
              key={event.id}
              onClick={() => navigate(`/social/event/${event.id}`)}
              className="card overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded">
                    {event.type === 'party' ? '聚会' : event.type === 'competition' ? '比赛' : event.type === 'training' ? '训练' : '领养'}
                  </span>
                  {event.isJoined && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                      已报名
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800">{event.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{dayjs(event.date).format('MM月DD日 HH:mm')}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={14} />
                    <span>{event.participants}/{event.maxParticipants}人</span>
                  </div>
                  <span className="text-sm text-orange-500">+{event.pointsReward}积分</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
