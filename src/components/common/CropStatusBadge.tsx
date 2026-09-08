import React from 'react';
import { CropStatus } from '../../types';
import { Calendar, Sprout, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface CropStatusBadgeProps {
  status: CropStatus;
}

export const CropStatusBadge: React.FC<CropStatusBadgeProps> = ({ status }) => {
  const configs: Record<CropStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    PLANNED: {
      label: 'Planned',
      bg: 'bg-slate-100 border-slate-200',
      text: 'text-slate-700',
      icon: <Calendar className="w-3.5 h-3.5" />,
    },
    PLANTED: {
      label: 'Planted',
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      icon: <Sprout className="w-3.5 h-3.5" />,
    },
    GROWING: {
      label: 'Growing',
      bg: 'bg-teal-50 border-teal-200',
      text: 'text-teal-800',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
    READY_FOR_HARVEST: {
      label: 'Ready for Harvest',
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      icon: <Sparkles className="w-3.5 h-3.5 animate-pulse" />,
    },
    HARVESTED: {
      label: 'Harvested',
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status] || configs.PLANNED;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
