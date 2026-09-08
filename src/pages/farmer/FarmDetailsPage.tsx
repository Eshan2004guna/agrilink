import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { farmService } from '../../services/farmService';
import { cropService } from '../../services/cropService';
import { Farm, Crop } from '../../types';
import { CropStatusBadge } from '../../components/common/CropStatusBadge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { useNotifications } from '../../context/NotificationContext';
import { ArrowLeft, MapPin, Layers, Edit, Trash2, Plus, Sprout, Calendar } from 'lucide-react';

export const FarmDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const farmData = await farmService.getFarmById(id);
        if (farmData) {
          setFarm(farmData);
          const cropData = await cropService.getCrops(undefined, farmData.id);
          setCrops(cropData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading farm specifications..." />;
  }

  if (!farm) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Farm Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/farmer/farms')}>
          Back to My Farms
        </Button>
      </div>
    );
  }

  const handleDeleteFarm = async () => {
    setIsDeleting(true);
    try {
      await farmService.deleteFarm(farm.id);
      showToast('Farm deleted', 'info');
      navigate('/farmer/farms');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete farm', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/farmer/farms')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Farms</span>
        </button>

        <div className="flex items-center gap-2">
          <Link to={`/farmer/farms/${farm.id}/edit`}>
            <Button variant="outline" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
              Edit Farm
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Farm
          </Button>
        </div>
      </div>

      {/* Farm Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 h-64 lg:h-auto relative bg-slate-100">
          <img src={farm.imageUrl} alt={farm.name} className="w-full h-full object-cover" />
        </div>

        <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              <MapPin className="w-3.5 h-3.5" />
              <span>{farm.city}, {farm.district}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{farm.name}</h1>
            <p className="text-xs text-slate-400 font-medium">Address: {farm.address}</p>

            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {farm.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Layers className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Land Size</span>
                <strong className="text-slate-900 font-extrabold text-base">{farm.landSize} {farm.landSizeUnit}</strong>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Sprout className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Crops Active</span>
                <strong className="text-slate-900 font-extrabold text-base">{crops.length} Planted</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Associated Crops Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Crops Planted On This Farm</h2>
            <p className="text-xs text-slate-500">Track cultivation schedules, harvest estimates, and stages.</p>
          </div>
          <Link to={`/farmer/crops/new?farmId=${farm.id}`}>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Crop
            </Button>
          </Link>
        </div>

        {crops.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Sprout className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No crops linked to this farm yet.</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Add your first crop to track planting dates and harvest estimates.</p>
            <Link to={`/farmer/crops/new?farmId=${farm.id}`}>
              <Button variant="secondary" size="sm">Add Crop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-3">Crop Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Planting Date</th>
                  <th className="pb-3">Expected Harvest</th>
                  <th className="pb-3">Expected Yield</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crops.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3.5 font-bold text-slate-900">{c.cropName}</td>
                    <td className="py-3.5 text-slate-600">{c.category}</td>
                    <td className="py-3.5 text-slate-600">{c.plantingDate}</td>
                    <td className="py-3.5 font-semibold text-slate-800">{c.expectedHarvestDate}</td>
                    <td className="py-3.5 font-extrabold text-emerald-700">{c.quantity} {c.unit}</td>
                    <td className="py-3.5">
                      <CropStatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteFarm}
        title="Delete Farm"
        message={`Are you sure you want to delete "${farm.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};
