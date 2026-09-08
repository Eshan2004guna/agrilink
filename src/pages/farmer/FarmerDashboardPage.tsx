import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmService } from '../../services/farmService';
import { cropService } from '../../services/cropService';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { Farm, Crop, Product, Order } from '../../types';
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { Button } from '../../components/common/Button';
import {
  Tractor,
  Sprout,
  Package,
  ShoppingBag,
  Plus,
  ArrowRight,
  Clock,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const FarmerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [farmData, cropData, prodData, orderData] = await Promise.all([
          farmService.getFarms(user.id),
          cropService.getCrops(user.id),
          productService.getProducts({ farmerId: user.id }),
          orderService.getOrders('FARMER', user.id),
        ]);
        setFarms(farmData);
        setCrops(cropData);
        setProducts(prodData);
        setOrders(orderData);
      } catch (err) {
        console.error('Failed to load farmer dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading your farmer portal overview..." />;
  }

  const newOrdersCount = orders.filter((o) => o.status === 'PENDING').length;
  const activeCropsCount = crops.filter((c) => c.status !== 'HARVESTED').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-emerald-800 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            Farmer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Ayubowan, {user?.firstName} {user?.lastName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage your Sri Lankan farms, crops, produce listings, and buyer orders.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/farmer/farms/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Farm
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/farmer/products/new')}
            leftIcon={<Plus className="w-4 h-4" />}
            className="bg-amber-400 text-slate-950 font-bold hover:bg-amber-300"
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* 4 Statistics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Farms */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase text-slate-400">Total Farms</span>
            <div className="p-2 rounded-xl bg-emerald-50">
              <Tractor className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{farms.length}</div>
          <Link to="/farmer/farms" className="text-xs font-semibold text-emerald-700 hover:underline inline-block pt-1">
            View registered farms →
          </Link>
        </div>

        {/* Active Crops */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-teal-700">
            <span className="text-xs font-bold uppercase text-slate-400">Active Crops</span>
            <div className="p-2 rounded-xl bg-teal-50">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{activeCropsCount}</div>
          <Link to="/farmer/crops" className="text-xs font-semibold text-teal-700 hover:underline inline-block pt-1">
            View crop stages →
          </Link>
        </div>

        {/* Active Products */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase text-slate-400">Active Products</span>
            <div className="p-2 rounded-xl bg-amber-50">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{products.length}</div>
          <Link to="/farmer/products" className="text-xs font-semibold text-amber-700 hover:underline inline-block pt-1">
            Manage product listings →
          </Link>
        </div>

        {/* New Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-bold uppercase text-slate-400">New Orders</span>
            <div className="p-2 rounded-xl bg-blue-50">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 flex items-center gap-2">
            {orders.length}
            {newOrdersCount > 0 && (
              <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                {newOrdersCount} Pending
              </span>
            )}
          </div>
          <Link to="/farmer/orders" className="text-xs font-semibold text-blue-700 hover:underline inline-block pt-1">
            Track customer orders →
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Orders + Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Recent Orders Received</h3>
            <Link to="/farmer/orders" className="text-xs font-bold text-emerald-700 hover:underline">
              View All Orders
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No orders received yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Buyer Name</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{ord.orderNumber}</td>
                      <td className="py-3 font-medium text-slate-700">{ord.buyerName}</td>
                      <td className="py-3 text-slate-600">{ord.items.length} product(s)</td>
                      <td className="py-3 font-extrabold text-emerald-700">Rs. {ord.totalAmount.toLocaleString()}</td>
                      <td className="py-3">
                        <OrderStatusBadge status={ord.status} size="sm" />
                      </td>
                      <td className="py-3 text-right">
                        <Link to={`/farmer/orders/${ord.id}`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Products Column */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Your Active Products</h3>
            <Link to="/farmer/products" className="text-xs font-bold text-emerald-700 hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 3).map((prod) => (
              <div key={prod.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50">
                <img src={prod.imageUrls[0]} alt={prod.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                  <p className="text-[11px] text-emerald-700 font-extrabold">Rs. {prod.price.toLocaleString()} / {prod.unit}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{prod.availableQuantity} in stock</span>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/farmer/products/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Listing
          </Button>
        </div>
      </div>
    </div>
  );
};
