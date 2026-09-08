import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge';
import { SearchBar } from '../../components/marketplace/SearchBar';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ShoppingBag, Eye, MapPin, Phone, User } from 'lucide-react';

export const AdminOrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Order for detail modal view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders('ADMIN');
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.district.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All Statuses' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h1 className="text-2xl font-extrabold text-slate-900">Global Order Surveillance</h1>
        <p className="text-xs text-slate-500">Monitor all buyer orders and farmer fulfillment across Sri Lanka.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by order #, buyer name, or district..." />
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
        <LoadingSpinner fullPage={false} message="Loading all platform orders..." />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10" />}
          title="No Orders Found"
          description="No trade orders match your search criteria."
          actionText="Clear Filters"
          onAction={() => { setSearch(''); setSelectedStatus('All Statuses'); }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Buyer</th>
                  <th className="pb-3">District</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="py-4 font-bold text-slate-900">{ord.orderNumber}</td>
                    <td className="py-4 font-semibold text-slate-800">{ord.buyerName}</td>
                    <td className="py-4 text-slate-500">{ord.district}</td>
                    <td className="py-4 text-slate-600">{ord.items.length} item(s)</td>
                    <td className="py-4 font-extrabold text-emerald-700">Rs. {ord.totalAmount.toLocaleString()}</td>
                    <td className="py-4">
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td className="py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(ord)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect
                      </Button>
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

      {/* Admin Order Inspection Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details: ${selectedOrder?.orderNumber}`}
        maxWidth="lg"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-slate-400 block text-[10px]">Order Date</span>
                <span className="font-bold text-slate-800">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Buyer Details</h4>
                <p>Name: <strong>{selectedOrder.buyerName}</strong></p>
                <p>Email: {selectedOrder.buyerEmail}</p>
                <p>Phone: {selectedOrder.buyerPhone}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Delivery Destination</h4>
                <p>District: <strong>{selectedOrder.district}</strong></p>
                <p>Address: {selectedOrder.address}</p>
                <p>Recipient: {selectedOrder.deliveryName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Ordered Produce List</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl p-2">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 px-1">
                    <div>
                      <strong className="font-bold text-slate-900">{item.productName}</strong>
                      <span className="text-slate-400 block text-[11px]">Seller: {item.farmerName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">{item.quantity} {item.unit}</span>
                      <span className="text-emerald-700 font-extrabold block">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="text-slate-500">Total Order Amount</span>
              <span className="text-xl font-black text-emerald-700">Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
