import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Filter } from 'lucide-react';
import { mockProducts } from '@/data/mock';

const categories = [
  { id: 'all', label: '全部' },
  { id: 'food', label: '宠物食品' },
  { id: 'supplies', label: '宠物用品' },
  { id: 'toy', label: '玩具' },
];

export default function Mall() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filteredProducts = mockProducts.filter(p => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (searchText && !p.name.includes(searchText)) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="搜索商品"
              className="w-full pl-12 pr-4 py-2.5 rounded-full bg-gray-100 outline-none text-sm"
            />
          </div>
          <ShoppingCart size={24} className="text-gray-600 cursor-pointer" />
          <Filter size={24} className="text-gray-600 cursor-pointer" />
        </div>
      </div>

      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex gap-6 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 pb-2 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-r from-primary-500 to-orange-400 rounded-2xl p-6 text-white mb-6">
          <h3 className="text-lg font-bold">新人专享</h3>
          <p className="text-sm opacity-90 mt-1">首单立减20元</p>
          <button className="mt-3 bg-white text-primary-500 px-4 py-1.5 rounded-full text-sm font-medium">
            立即领取
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => navigate(`/mall/product/${product.id}`)}
              className="card overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-800 line-clamp-2 h-10">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-bold text-primary-500">¥{product.price}</span>
                  <span className="text-xs text-gray-400 line-through">¥{product.originalPrice}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">已售{product.sales}</span>
                  <span className="text-xs text-gray-400">{product.warehouse}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
