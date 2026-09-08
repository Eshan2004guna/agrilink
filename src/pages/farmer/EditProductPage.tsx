import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { farmService } from '../../services/farmService';
import { Farm, Product } from '../../types';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { useNotifications } from '../../context/NotificationContext';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables',
    price: 250,
    availableQuantity: 100,
    unit: 'kg',
    farmId: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadDetails = async () => {
      if (!id || !user) return;
      setIsLoading(true);
      try {
        const [prod, farmList] = await Promise.all([
          productService.getProductById(id),
          farmService.getFarms(user.id),
        ]);
        setFarms(farmList);
        if (prod) {
          setFormData({
            name: prod.name,
            description: prod.description,
            category: prod.category,
            price: prod.price,
            availableQuantity: prod.availableQuantity,
            unit: prod.unit,
            farmId: prod.farmId,
            imageUrl: prod.imageUrls[0] || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id, user]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading product information..." />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      await productService.updateProduct(id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        availableQuantity: Number(formData.availableQuantity),
        unit: formData.unit,
        farmId: formData.farmId,
        imageUrls: [formData.imageUrl],
      });

      showToast('Product updated successfully!', 'success');
      navigate('/farmer/products');
    } catch (err: any) {
      showToast(err.message || 'Failed to update product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/farmer/products')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Return</span>
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Product Listing</h1>
          <p className="text-xs text-slate-500">Update price, stock, and descriptions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Select Origin Farm"
              value={formData.farmId}
              onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
              options={farms.map((f) => ({ value: f.id, label: f.name }))}
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['Vegetables', 'Fruits', 'Spices & Herbs', 'Grains & Rice', 'Coconut Products', 'Tea & Beverage']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Price (Rs. LKR)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
            <Input
              label="Available Stock"
              type="number"
              value={formData.availableQuantity}
              onChange={(e) => setFormData({ ...formData, availableQuantity: Number(e.target.value) })}
              required
            />
            <Select
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={['kg', 'Packs', 'Pieces', 'Metric Tons', 'Bundles']}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              className="block w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Input
            label="Product Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            leftIcon={<ImageIcon className="w-4 h-4" />}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => navigate('/farmer/products')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving} className="bg-emerald-700 hover:bg-emerald-800">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
