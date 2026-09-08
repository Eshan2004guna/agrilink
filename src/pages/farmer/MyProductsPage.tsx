import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
import { Package, Plus, Edit, Trash2, Eye } from 'lucide-react';

export const MyProductsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await productService.getProducts({ farmerId: user.id });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
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
      showToast('Product listing removed', 'info');
      setDeleteTargetId(null);
      loadProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Product Listings</h1>
          <p className="text-xs text-slate-500">Manage agricultural items listed on the public marketplace.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/farmer/products/new')}
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          Add Product
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8">
          <SearchBar value={search} onChange={setSearch} placeholder="Search product name or category..." />
        </div>
        <div className="sm:col-span-4">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={['All', 'Vegetables', 'Fruits', 'Spices & Herbs', 'Grains & Rice', 'Coconut Products', 'Tea & Beverage']}
          />
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <LoadingSpinner fullPage={false} message="Loading your produce listings..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Package className="w-10 h-10" />}
          title="No Products Listed"
          description={search ? "No products matched your search filters." : "You haven't added any products to the public marketplace yet."}
          actionText={search ? "Clear Filters" : "Add Product Now"}
          onAction={search ? () => setSearch('') : () => navigate('/farmer/products/new')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price / Unit</th>
                  <th className="pb-3">Available Stock</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrls[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                        <div>
                          <span className="font-bold text-slate-900 block">{p.name}</span>
                          <span className="text-[11px] text-slate-400">{p.farmName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-600 font-medium">{p.category}</td>
                    <td className="py-3.5 font-extrabold text-emerald-700">Rs. {p.price.toLocaleString()} / {p.unit}</td>
                    <td className="py-3.5 font-bold text-slate-800">{p.availableQuantity} {p.unit}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/marketplace/${p.id}`)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/farmer/products/${p.id}/edit`)}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Delete Product"
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
        title="Delete Product Listing"
        message="Are you sure you want to remove this product from the marketplace?"
        isLoading={isDeleting}
      />
    </div>
  );
};
