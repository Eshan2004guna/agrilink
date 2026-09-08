import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmService } from '../../services/farmService';
import { SRI_LANKA_DISTRICTS, LandSizeUnit } from '../../types';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { useNotifications } from '../../context/NotificationContext';
import { ArrowLeft, Image as ImageIcon, Tractor } from 'lucide-react';

export const AddFarmPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    district: 'Nuwara Eliya',
    city: '',
    address: '',
    landSize: 1,
    landSizeUnit: 'Acres' as LandSizeUnit,
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const sampleImages = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb16655?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Farm name is required';
    if (!formData.city) newErrors.city = 'City/town is required';
    if (!formData.address) newErrors.address = 'Farm street address is required';
    if (formData.landSize <= 0) newErrors.landSize = 'Land size must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await farmService.createFarm({
        name: formData.name,
        description: formData.description || 'High-yielding Sri Lankan agricultural land.',
        district: formData.district,
        city: formData.city,
        address: formData.address,
        landSize: Number(formData.landSize),
        landSizeUnit: formData.landSizeUnit,
        imageUrl: formData.imageUrl || sampleImages[0],
        farmerId: user.id,
        farmerName: `${user.firstName} ${user.lastName}`,
      });

      showToast('Farm created successfully!', 'success');
      navigate('/farmer/farms');
    } catch (err: any) {
      showToast(err.message || 'Failed to add farm', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/farmer/farms')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Farms</span>
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">Register New Farm Unit</h1>
          <p className="text-xs text-slate-500">Provide land details, district location, and acreage size.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Farm Name"
            placeholder="e.g. Nuwara Eliya Highland Organic Farm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="District"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              options={[...SRI_LANKA_DISTRICTS]}
            />
            <Input
              label="City / Town"
              placeholder="e.g. Lindula"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              error={errors.city}
              required
            />
          </div>

          <Input
            label="Full Street Address"
            placeholder="No 45, Agro Ridge Road, Nuwara Eliya"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={errors.address}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Land Size"
              type="number"
              step="0.1"
              min="0.1"
              value={formData.landSize}
              onChange={(e) => setFormData({ ...formData, landSize: Number(e.target.value) })}
              error={errors.landSize}
              required
            />
            <Select
              label="Land Size Unit"
              value={formData.landSizeUnit}
              onChange={(e) => setFormData({ ...formData, landSizeUnit: e.target.value as LandSizeUnit })}
              options={['Acres', 'Perches', 'Hectares']}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Farm Description</label>
            <textarea
              rows={3}
              className="block w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
              placeholder="Briefly describe the farm soil type, irrigation sources, or primary crops cultivated..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Image URL with Preset Selector */}
          <div className="space-y-2">
            <Input
              label="Farm Image URL (Optional)"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              leftIcon={<ImageIcon className="w-4 h-4" />}
              helperText="Or select a preset sample photo below:"
            />

            <div className="flex gap-3 pt-1">
              {sampleImages.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: url })}
                  className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    formData.imageUrl === url ? 'border-emerald-700 ring-2 ring-emerald-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Preset sample" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => navigate('/farmer/farms')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isLoading} className="bg-emerald-700 hover:bg-emerald-800">
              Save Farm
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
