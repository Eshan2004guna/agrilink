import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge } from '../../components/common/OrderStatusBadge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ArrowLeft, MapPin, CheckCircle2, Clock, Truck, Package, Check } from 'lucide-react';

export const BuyerOrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Fetching order details..." />;
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/buyer/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const timelineSteps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'PENDING', label: 'Order Placed', icon: Clock },
    { status: 'CONFIRMED', label: 'Farmer Confirmed', icon: CheckCircle2 },
    { status: 'PROCESSING', label: 'Harvesting & Packing', icon: Package },
    { status: 'READY_FOR_DELIVERY', label: 'Out for Transit', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: Check },
  ];

  const getStepIndex = (st: OrderStatus) => {
    if (st === 'CANCELLED') return -1;
    return timelineSteps.findIndex((s) => s.status === st);
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/buyer/orders')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Order History</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">Order Tracking</span>
            <h1 className="text-2xl font-extrabold text-slate-900">{order.orderNumber}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Visual Order Timeline Progress Bar */}
        {order.status !== 'CANCELLED' ? (
          <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold uppercase text-slate-400">Fulfillment Lifecycle Timeline</h4>
            <div className="grid grid-cols-5 gap-2 text-center pt-2">
              {timelineSteps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.status} className="space-y-2 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-emerald-700 text-white ring-4 ring-emerald-200'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-semibold leading-tight ${isPassed ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-xs font-semibold">
            This order has been cancelled. Please contact customer support if you have questions.
          </div>
        )}

        {/* Delivery Information */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs space-y-2">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Delivery Address</h3>
          <p className="flex items-center gap-2 text-slate-800 font-bold">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>{order.district} District</span>
          </p>
          <p className="text-slate-600 pl-6">{order.address}</p>
          <p className="text-slate-500 pl-6">Contact: {order.deliveryName} ({order.phone})</p>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-base">Ordered Produce Items</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Farmer</th>
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
                        <span className="font-bold text-slate-900">{item.productName}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{item.farmerName}</td>
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

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Total Amount Paid</span>
            <div className="text-2xl font-black text-emerald-700">
              Rs. {order.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
