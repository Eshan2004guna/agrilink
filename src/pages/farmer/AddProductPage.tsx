import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { farmService } from '../../services/farmService';
import { Farm } from '../../types';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { useNotifications } from '../../context/NotificationContext';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

export const AddProductPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [farms, setFarms] = useState<Farm[]>([]);
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

  const sampleProduceImages = [
    'https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1509358271058-acd05cc93898?auto=format&fit=crop&q=80&w=800',
  ];

  useEffect(() => {
    const loadFarms = async () => {
      if (!user) return;
      try {
        const data = await farmService.getFarms(user.id);
        setFarms(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, farmId: data[0].id }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadFarms();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.farmId) newErrors.farmId = 'Please select a farm';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.availableQuantity <= 0) newErrors.availableQuantity = 'Quantity must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      await productService.createProduct({
        name: formData.name,
        description: formData.description || 'Freshly harvested agricultural produce from Sri Lanka.',
        category: formData.category,
        price: Number(formData.price),
        availableQuantity: Number(formData.availableQuantity),
        unit: formData.unit,
        farmId: formData.farmId,
        farmerId: user.id,
        farmerName: `${user.firstName} ${user.lastName}`,
        imageUrls: [formData.imageUrl || sampleProduceImages[0]],
      });

      showToast('Product listed on marketplace!', 'success');
      navigate('/farmer/products');
    } catch (err: any) {
      showToast(err.message || 'Failed to list product', 'error');
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
        <span>Back to My Products</span>
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">List Produce on Marketplace</h1>
          <p className="text-xs text-slate-500">Add price per unit in LKR, stock quantity, and images.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Product Name"
            placeholder="e.g. Organic Fresh Nuwara Eliya Carrots"
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
              options={farms.map((f) => ({ value: f.id, label: `${f.name} (${f.district})` }))}
              error={errors.farmId}
              required
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
              error={errors.price}
              required
            />
            <Input
              label="Available Stock"
              type="number"
              value={formData.availableQuantity}
              onChange={(e) => setFormData({ ...formData, availableQuantity: Number(e.target.value) })}
              error={errors.availableQuantity}
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
            <label className="block text-sm font-semibold text-slate-700">Product Description</label>
            <textarea
              rows={3}
              className="block w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              placeholder="Describe freshness, harvest date, packaging details, and taste quality..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Image URL & Preset Selection */}
          <div className="space-y-2">
            <Input
              label="Product Image URL"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              leftIcon={<ImageIcon className="w-4 h-4" />}
              helperText="Or click one of these sample produce photos:"
            />

            <div className="flex gap-3 pt-1">
              {sampleProduceImages.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: url })}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    formData.imageUrl === url ? 'border-emerald-700 ring-2 ring-emerald-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Preset produce photo" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => navigate('/farmer/products')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving} className="bg-emerald-700 hover:bg-emerald-800">
              Save Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
