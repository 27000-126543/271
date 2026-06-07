import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Truck, Shield, RefreshCw } from 'lucide-react';
import { mockProducts } from '@/data/mock';
import { useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="p-4">商品不存在</div>;
  }

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold">商品详情</h2>
        <Heart size={24} className="text-gray-600" />
      </div>

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-72 object-cover"
      />

      <div className="bg-white p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary-500">¥{product.price}</span>
          <span className="text-sm text-gray-400 line-through">¥{product.originalPrice}</span>
          <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded">
            {discount}%OFF
          </span>
        </div>
        <h1 className="text-lg font-semibold text-gray-800 mt-3">{product.name}</h1>
        <p className="text-sm text-gray-500 mt-2">{product.description}</p>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span>库存 {product.stock}</span>
          <span>已售 {product.sales}</span>
        </div>
      </div>

      <div className="bg-white mt-3 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">服务保障</h3>
        <div className="flex gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Truck size={16} className="text-primary-500" />
            <span>就近发货</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={16} className="text-primary-500" />
            <span>正品保障</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw size={16} className="text-primary-500" />
            <span>7天退换</span>
          </div>
        </div>
      </div>

      <div className="bg-white mt-3 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">发货仓库</h3>
        <p className="text-sm text-gray-600">{product.warehouse}发货，预计1-2天送达</p>
      </div>

      <div className="bg-white mt-3 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">购买数量</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            -
          </button>
          <span className="text-lg font-medium w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-gray-100 p-4">
        <div className="flex gap-3">
          <button className="btn-secondary flex-1">
            加入购物车
          </button>
          <button className="btn-primary flex-1">
            立即购买 ¥{product.price * quantity}
          </button>
        </div>
      </div>
    </div>
  );
}
