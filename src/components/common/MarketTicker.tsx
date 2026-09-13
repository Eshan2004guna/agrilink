import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, ArrowRight, BarChart3 } from 'lucide-react';
import { marketPriceService, MarketPriceItem } from '../../services/marketPriceService';

export const MarketTicker: React.FC = () => {
  const [items, setItems] = useState<MarketPriceItem[]>([]);

  useEffect(() => {
    const loadPrices = async () => {
      const data = await marketPriceService.getMarketPrices();
      setItems(data);
    };
    loadPrices();
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="bg-slate-950 text-slate-300 border-b border-emerald-950 text-xs py-2 overflow-hidden shadow-inner relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Tag */}
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daily Market Index</span>
          </div>
        </div>

        {/* Scrolling Ticker Items */}
        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap flex items-center gap-6 py-0.5 text-[11px] font-medium">
          {items.map((item) => (
            <div key={item.id} className="inline-flex items-center gap-2 shrink-0">
              <span className="font-bold text-slate-200">{item.cropName}:</span>
              <span className="text-emerald-400 font-bold">Rs. {item.wholesalePrice}</span>
              <span className="text-slate-500 font-normal">/{item.unit}</span>

              {item.trend === 'UP' && (
                <span className="inline-flex items-center text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded text-[10px]">
                  <TrendingUp className="w-3 h-3 mr-0.5" />+{item.priceChange}
                </span>
              )}
              {item.trend === 'DOWN' && (
                <span className="inline-flex items-center text-red-400 font-bold bg-red-950/80 px-1.5 py-0.5 rounded text-[10px]">
                  <TrendingDown className="w-3 h-3 mr-0.5" />{item.priceChange}
                </span>
              )}
              {item.trend === 'STABLE' && (
                <span className="inline-flex items-center text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded text-[10px]">
                  <Minus className="w-3 h-3 mr-0.5" />0
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Right Action Link */}
        <Link
          to="/market-prices"
          className="shrink-0 pl-3 border-l border-slate-800 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
        >
          <span>View All Rates</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
