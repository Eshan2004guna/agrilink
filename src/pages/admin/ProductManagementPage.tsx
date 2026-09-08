import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { SearchBar } from '../../components/marketplace/SearchBar';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { useNotifications } from '../../context/NotificationContext';
import { Package, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductManagementPage: React.FC = () => {
  const { showToast } = useNotifications();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(deleteTargetId);
      showToast('Product listing removed by admin', 'info');
      setDeleteTargetId(null);
      loadProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h1 className="text-2xl font-extrabold text-slate-900">Product Moderation Portal</h1>
        <p className="text-xs text-slate-500">Monitor all registered agricultural product listings across Sri Lanka.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8">
          <SearchBar value={search} onChange={setSearch} placeholder="Search product name, farmer, or district..." />
        </div>
        <div className="sm:col-span-4">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={['All', 'Vegetables', 'Fruits', 'Spices & Herbs', 'Grains & Rice', 'Coconut Products', 'Tea & Beverage']}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner fullPage={false} message="Loading all platform products..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Package className="w-10 h-10" />}
          title="No Products Found"
          description="No produce listings match your filter criteria."
          actionText="Clear Filters"
          onAction={() => { setSearch(''); setSelectedCategory('All'); }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Farmer</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">District</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrls[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <strong className="font-bold text-slate-900 block">{p.name}</strong>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-700 font-medium">{p.farmerName}</td>
                    <td className="py-3.5 text-slate-500">{p.category}</td>
                    <td className="py-3.5 font-extrabold text-emerald-700">Rs. {p.price.toLocaleString()} / {p.unit}</td>
                    <td className="py-3.5 font-bold text-slate-800">{p.availableQuantity} {p.unit}</td>
                    <td className="py-3.5 text-slate-600">{p.district}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/marketplace/${p.id}`}>
                          <button className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg" title="View Public Page">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteTargetId(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Remove Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Moderate Product"
        message="Are you sure you want to remove this product listing from the public marketplace?"
        confirmText="Remove Product"
        isLoading={isDeleting}
      />
    </div>
  );
};
