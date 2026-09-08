import React from 'react';
import { Link } from 'react-router-dom';
import { Farm } from '../../types';
import { MapPin, Sprout, Layers, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';

interface FarmCardProps {
  farm: Farm;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  onDelete,
  showActions = true,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
      <div className="relative h-44 w-full bg-slate-100">
        <img
          src={farm.imageUrl}
          alt={farm.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{farm.district}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{farm.name}</h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {farm.description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="text-slate-400 block text-[10px]">Land Size</span>
                <strong className="text-slate-800">{farm.landSize} {farm.landSizeUnit}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="text-slate-400 block text-[10px]">Crops</span>
                <strong className="text-slate-800">{farm.cropCount} Active</strong>
              </div>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <Link to={`/farmer/farms/${farm.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                View
              </Button>
            </Link>
            <Link to={`/farmer/farms/${farm.id}/edit`}>
              <Button variant="ghost" size="sm" leftIcon={<Edit className="w-3.5 h-3.5 text-slate-600" />} />
            </Link>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => onDelete(farm.id)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
