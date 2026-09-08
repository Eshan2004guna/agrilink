import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { SearchBar } from '../../components/marketplace/SearchBar';
import { FilterPanel } from '../../components/marketplace/FilterPanel';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorMessage } from '../../components/feedback/ErrorMessage';
import { SlidersHorizontal, Store } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodData, catData] = await Promise.all([
        productService.getProducts({
          search: searchQuery,
          category: selectedCategory,
          district: selectedDistrict.startsWith('All') ? undefined : selectedDistrict,
          maxPrice,
          sort: sortBy,
        }),
        categoryService.getCategories(),
      ]);

      setProducts(prodData);
      setCategories(catData);
    } catch (err: any) {
      setError(err.message || 'Failed to load marketplace products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedDistrict, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDistrict('All Districts');
    setMaxPrice(3000);
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Calculate pagination slice
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 bg-emerald-800 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            Fresh Produce Marketplace
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Sri Lanka Agricultural Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Browse fresh vegetables, tea leaves, spices, grains, and fruits direct from registered Sri Lankan farmers.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="block lg:hidden w-full md:w-auto">
          <Button
            variant="secondary"
            className="w-full bg-white text-emerald-950 font-bold hover:bg-emerald-100"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          >
            {isMobileFilterOpen ? 'Hide Filters' : 'Show Filter Drawer'}
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Filter Panel Sidebar */}
        <aside className={`lg:col-span-3 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24">
            <FilterPanel
              categories={categories.map((c) => c.name)}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedDistrict={selectedDistrict}
              onDistrictChange={setSelectedDistrict}
              maxPrice={maxPrice}
              onPriceChange={setMaxPrice}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onReset={handleResetFilters}
            />
          </div>
        </aside>

        {/* Products Grid & Search */}
        <section className="lg:col-span-9 space-y-6">
          {/* Search Bar Container */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Found <strong className="text-slate-900 font-bold">{products.length}</strong> fresh products
            </span>
            {(selectedCategory !== 'All' || selectedDistrict !== 'All Districts' || searchQuery) && (
              <span className="text-emerald-700 font-medium">
                Active filters applied
              </span>
            )}
          </div>

          {/* Loading, Error, Empty, or Product Grid */}
          {isLoading ? (
            <LoadingSpinner fullPage={false} message="Loading fresh harvest products..." />
          ) : error ? (
            <ErrorMessage title="Could not load products" message={error} onRetry={loadData} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<Store className="w-10 h-10" />}
              title="No Products Found"
              description="No agricultural products match your search query or filter selection. Try adjusting your filters."
              actionText="Reset Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={products.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
