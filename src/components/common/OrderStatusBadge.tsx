import React from 'react';
import { OrderStatus } from '../../types';
import { Clock, CheckCircle2, PackageCheck, Truck, Check, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<OrderStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    PENDING: {
      label: 'Pending',
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    CONFIRMED: {
      label: 'Confirmed',
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    PROCESSING: {
      label: 'Processing',
      bg: 'bg-purple-50 border-purple-200',
      text: 'text-purple-800',
      icon: <PackageCheck className="w-3.5 h-3.5" />,
    },
    READY_FOR_DELIVERY: {
      label: 'Ready for Delivery',
      bg: 'bg-indigo-50 border-indigo-200',
      text: 'text-indigo-800',
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    DELIVERED: {
      label: 'Delivered',
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      icon: <Check className="w-3.5 h-3.5" />,
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status] || configs.PENDING;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${padding}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
