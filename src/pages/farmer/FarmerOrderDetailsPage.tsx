import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { useNotifications } from '../../context/NotificationContext';
import { ArrowLeft, User, Phone, MapPin, Calendar, CheckCircle2, XCircle, Truck, Package } from 'lucide-react';

export const FarmerOrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusSelect, setStatusSelect] = useState<OrderStatus>('PENDING');

  const loadOrder = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await orderService.getOrderById(id);
      if (data) {
        setOrder(data);
        setStatusSelect(data.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Fetching order details..." />;
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/farmer/orders')}>
          Back to Orders List
        </Button>
      </div>
    );
  }

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const updated = await orderService.updateOrderStatus(order.id, newStatus);
      setOrder(updated);
      setStatusSelect(updated.status);
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/farmer/orders')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </button>

        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Main Order Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">Order Reference</span>
            <h1 className="text-2xl font-extrabold text-slate-900">{order.orderNumber}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Workflow Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {order.status === 'PENDING' && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus('CONFIRMED')}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  Confirm Order
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus('CANCELLED')}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Reject Order
                </Button>
              </>
            )}

            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
              <div className="flex items-center gap-2">
                <Select
                  value={statusSelect}
                  onChange={(e) => setStatusSelect(e.target.value as OrderStatus)}
                  options={['PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']}
                  className="py-1.5 text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={isUpdating}
                  onClick={() => handleUpdateStatus(statusSelect)}
                >
                  Update
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Buyer & Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Buyer Contact Info</h3>
            <p className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4 text-emerald-700" />
              <strong>{order.buyerName}</strong>
            </p>
            <p className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{order.buyerPhone}</span>
            </p>
            <p className="text-slate-500 pl-6">{order.buyerEmail}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Delivery Location</h3>
            <p className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <strong>{order.district} District</strong>
            </p>
            <p className="text-slate-600 pl-6 leading-relaxed">{order.address}</p>
            <p className="text-slate-500 pl-6">Recipient: {order.deliveryName}</p>
          </div>
        </div>

        {/* Ordered Products Table */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-slate-900 text-base">Ordered Products</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <strong className="font-bold text-slate-900 block">{item.productName}</strong>
                          <span className="text-[11px] text-slate-400">Seller: {item.farmerName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">Rs. {item.price.toLocaleString()} / {item.unit}</td>
                    <td className="p-3 font-bold text-slate-900">{item.quantity} {item.unit}</td>
                    <td className="p-3 text-right font-extrabold text-emerald-700">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary Total */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <div className="text-right space-y-1">
            <span className="text-xs text-slate-500">Total Order Amount</span>
            <div className="text-2xl font-black text-emerald-700">
              Rs. {order.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
