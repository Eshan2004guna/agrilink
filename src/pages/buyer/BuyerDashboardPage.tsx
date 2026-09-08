import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { Order, Product } from '../../types';
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { ShoppingBag, ShoppingCart, Store, ArrowRight, Clock, MapPin } from 'lucide-react';

export const BuyerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBuyerData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [userOrders, prods] = await Promise.all([
          orderService.getOrders('BUYER', user.id),
          productService.getProducts({ isFeatured: true }),
        ]);
        setOrders(userOrders);
        setRecommended(prods.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBuyerData();
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading buyer workspace..." />;
  }

  const pendingCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PROCESSING').length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-blue-800 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            Buyer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track your farm produce orders and discover fresh harvests direct from growers.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/marketplace')}
          leftIcon={<Store className="w-4 h-4" />}
          className="bg-emerald-600 hover:bg-emerald-500 font-bold"
        >
          Explore Marketplace
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Total Orders Placed</span>
          <div className="text-3xl font-black text-slate-900">{orders.length}</div>
          <Link to="/buyer/orders" className="text-xs font-semibold text-blue-700 hover:underline block pt-1">
            View order history →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Pending & Processing</span>
          <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
          <span className="text-xs text-slate-400 block pt-1">Active fulfillment orders</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Delivered Orders</span>
          <div className="text-3xl font-black text-emerald-700">
            {orders.filter((o) => o.status === 'DELIVERED').length}
          </div>
          <span className="text-xs text-slate-400 block pt-1">Completed fresh harvests</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">Recent Orders</h3>
          <Link to="/buyer/orders" className="text-xs font-bold text-blue-700 hover:underline">
            View All
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            You haven't placed any orders yet. Visit the marketplace to order fresh agricultural produce!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">District</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 3).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">{ord.orderNumber}</td>
                    <td className="py-3 text-slate-600">{ord.district}</td>
                    <td className="py-3 font-extrabold text-emerald-700">Rs. {ord.totalAmount.toLocaleString()}</td>
                    <td className="py-3">
                      <OrderStatusBadge status={ord.status} size="sm" />
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/buyer/orders/${ord.id}`}>
                        <Button variant="outline" size="sm">Details</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recommended Fresh Produce */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">Recommended Produce For You</h3>
          <Link to="/marketplace" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
            <span>Browse Full Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};
