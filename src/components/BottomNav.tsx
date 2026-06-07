import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Scissors, ShoppingBag, Users, User } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/services', icon: Scissors, label: '服务' },
  { path: '/mall', icon: ShoppingBag, label: '商城' },
  { path: '/social', icon: Users, label: '社区' },
  { path: '/profile', icon: User, label: '我的' },
];

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 max-w-[430px] mx-auto">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
            }
          >
            <item.icon size={22} />
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
