import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  LayoutDashboard,
  Tractor,
  Sprout,
  Package,
  ShoppingBag,
  Bell,
  User as UserIcon,
  LogOut,
  Users,
  Layers,
  ShieldAlert,
  ShoppingCart,
  Store
} from 'lucide-react';

interface SidebarProps {
  role: 'FARMER' | 'BUYER' | 'ADMIN';
}

interface SidebarLink {
  name: string;
  path: string;
  icon: any;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const farmerLinks: SidebarLink[] = [
    { name: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
    { name: 'My Farms', path: '/farmer/farms', icon: Tractor },
    { name: 'My Crops', path: '/farmer/crops', icon: Sprout },
    { name: 'My Products', path: '/farmer/products', icon: Package },
    { name: 'Orders', path: '/farmer/orders', icon: ShoppingBag },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const buyerLinks: SidebarLink[] = [
    { name: 'Dashboard', path: '/buyer/dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', path: '/marketplace', icon: Store },
    { name: 'My Cart', path: '/cart', icon: ShoppingCart },
    { name: 'My Orders', path: '/buyer/orders', icon: ShoppingBag },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const adminLinks: SidebarLink[] = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Farmers', path: '/admin/users?role=FARMER', icon: Tractor },
    { name: 'Buyers', path: '/admin/users?role=BUYER', icon: UserIcon },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const links = role === 'FARMER' ? farmerLinks : role === 'ADMIN' ? adminLinks : buyerLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shrink-0 shadow-2xs">
      <div className="space-y-6">
        {/* Role Header Badge */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-xs ${
              role === 'FARMER'
                ? 'bg-emerald-700'
                : role === 'ADMIN'
                ? 'bg-purple-700'
                : 'bg-blue-600'
            }`}
          >
            {role === 'FARMER' ? (
              <Tractor className="w-5 h-5" />
            ) : role === 'ADMIN' ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Portal</h4>
            <p className="text-sm font-bold text-slate-800">{role} Workspace</p>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 ? (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Logout Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
