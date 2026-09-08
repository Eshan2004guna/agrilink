import React from 'react';
import { SRI_LANKA_DISTRICTS } from '../../types';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';
import { Select } from '../common/Select';

interface FilterPanelProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedDistrict: string;
  onDistrictChange: (dist: string) => void;
  maxPrice: number;
  onPriceChange: (price: number) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedDistrict,
  onDistrictChange,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* District Filter */}
      <div className="space-y-2">
        <Select
          label="District / Location"
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          options={['All Districts', ...SRI_LANKA_DISTRICTS]}
        />
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">Max Price</span>
          <span className="font-extrabold text-emerald-700 text-sm">Rs. {maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="50"
          max="3000"
          step="50"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-emerald-700 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Rs. 50</span>
          <span>Rs. 3,000+</span>
        </div>
      </div>

      {/* Sort By Filter */}
      <div className="space-y-2">
        <Select
          label="Sort Products"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          options={[
            { value: 'newest', label: 'Newest Arrivals' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'name', label: 'Product Name (A-Z)' },
          ]}
        />
      </div>
    </div>
  );
};
