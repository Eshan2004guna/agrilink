import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cropService } from '../../services/cropService';
import { farmService } from '../../services/farmService';
import { Farm, CropStatus } from '../../types';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { useNotifications } from '../../context/NotificationContext';
import { ArrowLeft, Sprout } from 'lucide-react';

export const AddCropPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFarmId = searchParams.get('farmId') || '';
  const { showToast } = useNotifications();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    farmId: initialFarmId,
    cropName: '',
    category: 'Vegetables',
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: 500,
    unit: 'kg',
    status: 'PLANTED' as CropStatus,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadFarms = async () => {
      if (!user) return;
      try {
        const data = await farmService.getFarms(user.id);
        setFarms(data);
        if (!formData.farmId && data.length > 0) {
          setFormData((prev) => ({ ...prev, farmId: data[0].id }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingFarms(false);
      }
    };
    loadFarms();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newErrors: Record<string, string> = {};
    if (!formData.farmId) newErrors.farmId = 'Please select a farm';
    if (!formData.cropName) newErrors.cropName = 'Crop name is required';
    if (!formData.plantingDate) newErrors.plantingDate = 'Planting date is required';
    if (!formData.expectedHarvestDate) newErrors.expectedHarvestDate = 'Expected harvest date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedFarmObj = farms.find((f) => f.id === formData.farmId);
    if (!selectedFarmObj) {
      setErrors({ farmId: 'Invalid farm selected' });
      return;
    }

    setIsSaving(true);
    try {
      await cropService.createCrop({
        cropName: formData.cropName,
        farmId: selectedFarmObj.id,
        farmName: selectedFarmObj.name,
        farmerId: user.id,
        category: formData.category,
        plantingDate: formData.plantingDate,
        expectedHarvestDate: formData.expectedHarvestDate,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        status: formData.status,
        notes: formData.notes,
      });

      showToast('Crop logged successfully!', 'success');
      navigate('/farmer/crops');
    } catch (err: any) {
      showToast(err.message || 'Failed to log crop', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/farmer/crops')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Crops</span>
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">Add New Crop Record</h1>
          <p className="text-xs text-slate-500">Log planting schedule, expected yield, and stage.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Select Farm"
            value={formData.farmId}
            onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
            options={farms.map((f) => ({ value: f.id, label: `${f.name} (${f.district})` }))}
            error={errors.farmId}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Crop Name"
              placeholder="e.g. Nuwara Eliya Orange Carrots"
              value={formData.cropName}
              onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
              error={errors.cropName}
              required
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['Vegetables', 'Fruits', 'Spices', 'Grains & Rice', 'Coconut Products', 'Tea & Beverage']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Planting Date"
              type="date"
              value={formData.plantingDate}
              onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
              error={errors.plantingDate}
              required
            />
            <Input
              label="Expected Harvest Date"
              type="date"
              value={formData.expectedHarvestDate}
              onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
              error={errors.expectedHarvestDate}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Estimated Yield Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              required
            />
            <Select
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={['kg', 'Packs', 'Pieces', 'Metric Tons', 'Bundles']}
            />
            <Select
              label="Crop Status Stage"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as CropStatus })}
              options={['PLANNED', 'PLANTED', 'GROWING', 'READY_FOR_HARVEST', 'HARVESTED']}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Notes / Fertilizer Log</label>
            <textarea
              rows={3}
              className="block w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              placeholder="e.g. Applied organic compost fertilizer on Day 15. High health."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => navigate('/farmer/crops')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving} className="bg-emerald-700 hover:bg-emerald-800">
              Save Crop Log
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
