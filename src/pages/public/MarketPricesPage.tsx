import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketPriceService, MarketPriceItem } from '../../services/marketPriceService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  BarChart3,
  Search,
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Info
} from 'lucide-react';

export const MarketPricesPage: React.FC = () => {
  const [prices, setPrices] = useState<MarketPriceItem[]>([]);
  const [selectedHub, setSelectedHub] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemForTrend, setSelectedItemForTrend] = useState<MarketPriceItem | null>(null);

  const navigate = useNavigate();

  const economicCentres = marketPriceService.getEconomicCentres();
  const categories = marketPriceService.getCategories();

  const loadPrices = async () => {
    setIsLoading(true);
    try {
      const data = await marketPriceService.getMarketPrices({
        economicCentre: selectedHub,
        category: selectedCategory,
        search: searchQuery,
      });
      setPrices(data);
      if (data.length > 0 && !selectedItemForTrend) {
        setSelectedItemForTrend(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, [selectedHub, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 pb-16 bg-slate-50/50 min-h-screen">
      {/* Rich Page Header */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sri Lanka Economic Price Index</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Daily District Market Rates
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Compare official daily wholesale prices at Sri Lanka's Dedicated Economic Centres (Dambulla, Keppetipola, Jaffna, Meegoda, Peliyagoda) with direct AgriLink farm rates.
              </p>
            </div>

            <div className="bg-emerald-900/70 border border-emerald-700/80 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Average Direct Savings</span>
                <span className="text-xl font-extrabold text-white">15% - 25% Off</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Controls Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {/* Top Row: Economic Centre Hub Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Filter by Dedicated Economic Centre:
            </label>
            <div className="flex flex-wrap gap-2">
              {economicCentres.map((hub) => (
                <button
                  key={hub}
                  onClick={() => setSelectedHub(hub)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedHub === hub
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 opacity-70" />
                  {hub === 'ALL' ? 'All Economic Hubs' : hub}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Row: Search & Category Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-slate-100 items-center">
            <div className="md:col-span-6">
              <Input
                placeholder="Search crop by name, district, or hub..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="md:col-span-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Commodity Trend View (Interactive Drawer/Banner) */}
        {selectedItemForTrend && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 flex items-center gap-4">
              <img
                src={selectedItemForTrend.imageUrl}
                alt={selectedItemForTrend.cropName}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {selectedItemForTrend.economicCentre} Economic Hub
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {selectedItemForTrend.cropName}
                </h3>
                <p className="text-xs text-slate-500">
                  Origin: {selectedItemForTrend.district} District • Last updated: {selectedItemForTrend.updatedAt}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Hub Wholesale Rate</span>
                <span className="text-base font-extrabold text-slate-900">
                  Rs. {selectedItemForTrend.wholesalePrice} <span className="text-[11px] font-normal text-slate-500">/{selectedItemForTrend.unit}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">AgriLink Direct Rate</span>
                <span className="text-base font-extrabold text-emerald-700">
                  Rs. {selectedItemForTrend.agriLinkDirectPrice} <span className="text-[11px] font-normal text-slate-500">/{selectedItemForTrend.unit}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">7-Day Trend</span>
                <div className="flex items-center justify-center gap-1 font-bold text-xs mt-1">
                  {selectedItemForTrend.trend === 'UP' && (
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +Rs. {selectedItemForTrend.priceChange}
                    </span>
                  )}
                  {selectedItemForTrend.trend === 'DOWN' && (
                    <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" /> -Rs. {Math.abs(selectedItemForTrend.priceChange)}
                    </span>
                  )}
                  {selectedItemForTrend.trend === 'STABLE' && (
                    <span className="text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Minus className="w-3.5 h-3.5" /> Stable
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Price Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-emerald-700" />
              <span>Live Commodity Price Index ({prices.length} items)</span>
            </h2>
            <button
              onClick={loadPrices}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Rates
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Commodity / Crop</th>
                  <th className="py-3.5 px-4">Economic Hub</th>
                  <th className="py-3.5 px-4">Hub Wholesale Price</th>
                  <th className="py-3.5 px-4">AgriLink Direct Price</th>
                  <th className="py-3.5 px-4">Direct Savings</th>
                  <th className="py-3.5 px-4">Trend Movement</th>
                  <th className="py-3.5 px-4 text-right">Marketplace Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prices.map((item) => {
                  const savingsAmount = item.wholesalePrice - item.agriLinkDirectPrice;
                  const savingsPercent = Math.round((savingsAmount / item.wholesalePrice) * 100);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItemForTrend(item)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        selectedItemForTrend?.id === item.id ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.cropName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{item.cropName}</div>
                            <div className="text-[11px] text-slate-400 font-normal">{item.district} District</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {item.economicCentre}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm">
                        Rs. {item.wholesalePrice} <span className="text-[11px] font-normal text-slate-500">/{item.unit}</span>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-emerald-700 text-sm">
                        Rs. {item.agriLinkDirectPrice} <span className="text-[11px] font-normal text-slate-500">/{item.unit}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg text-xs border border-emerald-300">
                          {savingsPercent}% OFF
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold">
                        {item.trend === 'UP' && (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> +Rs. {item.priceChange}
                          </span>
                        )}
                        {item.trend === 'DOWN' && (
                          <span className="text-red-600 flex items-center gap-1">
                            <TrendingDown className="w-3.5 h-3.5" /> -Rs. {Math.abs(item.priceChange)}
                          </span>
                        )}
                        {item.trend === 'STABLE' && (
                          <span className="text-slate-500 flex items-center gap-1">
                            <Minus className="w-3.5 h-3.5" /> Stable
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/marketplace');
                          }}
                          leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                          className="text-xs"
                        >
                          Buy Direct
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
