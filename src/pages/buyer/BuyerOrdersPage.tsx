import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge';
import { SearchBar } from '../../components/marketplace/SearchBar';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ShoppingBag, Eye } from 'lucide-react';

export const BuyerOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await orderService.getOrders('BUYER', user.id);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.district.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All Statuses' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h1 className="text-2xl font-extrabold text-slate-900">My Purchase Orders</h1>
        <p className="text-xs text-slate-500">Track your order statuses and direct farm purchases.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by order number..." />
        </div>
        <div className="sm:col-span-4">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              'All Statuses',
              'PENDING',
              'CONFIRMED',
              'PROCESSING',
              'READY_FOR_DELIVERY',
              'DELIVERED',
              'CANCELLED',
            ]}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner fullPage={false} message="Loading order history..." />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10" />}
          title="No Purchase History"
          description={search ? "No orders matched your search criteria." : "You haven't placed any orders yet."}
          actionText={search ? "Clear Search" : undefined}
          onAction={search ? () => setSearch('') : undefined}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Items Count</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="py-4 font-bold text-slate-900">{ord.orderNumber}</td>
                    <td className="py-4 text-slate-600">{ord.items.length} item(s)</td>
                    <td className="py-4 text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 font-extrabold text-emerald-700">Rs. {ord.totalAmount.toLocaleString()}</td>
                    <td className="py-4">
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td className="py-4 text-right">
                      <Link to={`/buyer/orders/${ord.id}`}>
                        <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredOrders.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};
