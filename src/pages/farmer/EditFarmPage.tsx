import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { farmService } from '../../services/farmService';
import { SRI_LANKA_DISTRICTS, LandSizeUnit, Farm } from '../../types';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { useNotifications } from '../../context/NotificationContext';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';

export const EditFarmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    const loadFarm = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const farm = await farmService.getFarmById(id);
        if (farm) {
          setFormData({
            name: farm.name,
            description: farm.description,
            district: farm.district,
            city: farm.city,
            address: farm.address,
            landSize: farm.landSize,
            landSizeUnit: farm.landSizeUnit,
            imageUrl: farm.imageUrl,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadFarm();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading farm data..." />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Farm name is required';
    if (!formData.city) newErrors.city = 'City/town is required';
    if (!formData.address) newErrors.address = 'Farm address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      await farmService.updateFarm(id, {
        name: formData.name,
        description: formData.description,
        district: formData.district,
        city: formData.city,
        address: formData.address,
        landSize: Number(formData.landSize),
        landSizeUnit: formData.landSizeUnit,
        imageUrl: formData.imageUrl,
      });

      showToast('Farm updated successfully!', 'success');
      navigate(`/farmer/farms/${id}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update farm', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(`/farmer/farms/${id}`)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Return</span>
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Farm Profile</h1>
          <p className="text-xs text-slate-500">Update land specifications and location details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Farm Name"
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
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              error={errors.city}
              required
            />
          </div>

          <Input
            label="Full Street Address"
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
              value={formData.landSize}
              onChange={(e) => setFormData({ ...formData, landSize: Number(e.target.value) })}
              required
            />
            <Select
              label="Land Size Unit"
              value={formData.landSizeUnit}
              onChange={(e) => setFormData({ ...formData, landSizeUnit: e.target.value as LandSizeUnit })}
              options={['Acres', 'Perches', 'Hectares']}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Farm Description</label>
            <textarea
              rows={3}
              className="block w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Input
            label="Farm Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            leftIcon={<ImageIcon className="w-4 h-4" />}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => navigate(`/farmer/farms/${id}`)}>
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
