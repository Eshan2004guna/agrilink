import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { farmService } from '../../services/farmService';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { User, Farm, Product, Order } from '../../types';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge';
import { Button } from '../../components/common/Button';
import { Users, Tractor, ShoppingCart, Package, ShoppingBag, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdminMetrics = async () => {
      setIsLoading(true);
      try {
        const [userData, farmData, prodData, orderData] = await Promise.all([
          userService.getAllUsers(),
          farmService.getFarms(),
          productService.getProducts(),
          orderService.getOrders('ADMIN'),
        ]);
        setUsers(userData);
        setFarms(farmData);
        setProducts(prodData);
        setOrders(orderData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAdminMetrics();
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading platform administration overview..." />;
  }

  const farmerCount = users.filter((u) => u.role === 'FARMER').length;
  const buyerCount = users.filter((u) => u.role === 'BUYER').length;
  const totalVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-purple-900 text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Platform Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Global oversight across Sri Lanka users, farms, produce listings, and trade orders.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-200">System Healthy</span>
        </div>
      </div>

      {/* 6 Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Users</span>
          <div className="text-2xl font-black text-slate-900">{users.length}</div>
          <Link to="/admin/users" className="text-[11px] text-purple-700 font-bold hover:underline block">Manage</Link>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Farmers</span>
          <div className="text-2xl font-black text-emerald-700">{farmerCount}</div>
          <span className="text-[11px] text-slate-400 block">Registered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Buyers</span>
          <div className="text-2xl font-black text-blue-700">{buyerCount}</div>
          <span className="text-[11px] text-slate-400 block">Active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Farms</span>
          <div className="text-2xl font-black text-slate-900">{farms.length}</div>
          <span className="text-[11px] text-slate-400 block">25 Districts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Products</span>
          <div className="text-2xl font-black text-amber-700">{products.length}</div>
          <Link to="/admin/products" className="text-[11px] text-amber-700 font-bold hover:underline block">Moderate</Link>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Orders</span>
          <div className="text-2xl font-black text-slate-900">{orders.length}</div>
          <Link to="/admin/orders" className="text-[11px] text-blue-700 font-bold hover:underline block">Audit</Link>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Registered Users */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Recent Platform Users</h3>
            <Link to="/admin/users" className="text-xs font-bold text-purple-700 hover:underline">
              View All Users
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">District</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.slice(0, 4).map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-2.5">
                      <strong className="text-slate-900 block">{u.firstName} {u.lastName}</strong>
                      <span className="text-[11px] text-slate-400">{u.email}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600">{u.district}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Orders Surveillance */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Global Trade Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-purple-700 hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-2">Order #</th>
                  <th className="pb-2">Buyer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 4).map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-900">{o.orderNumber}</td>
                    <td className="py-2.5 text-slate-700">{o.buyerName}</td>
                    <td className="py-2.5 font-extrabold text-emerald-700">Rs. {o.totalAmount.toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      <OrderStatusBadge status={o.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
