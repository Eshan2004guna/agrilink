import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cropService } from '../../services/cropService';
import { farmService } from '../../services/farmService';
import { Crop, Farm, CropStatus } from '../../types';
import { CropStatusBadge } from '../../components/common/CropStatusBadge';
import { SearchBar } from '../../components/marketplace/SearchBar';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Sprout, Plus, Calendar, Layers, Trash2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

export const MyCropsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [crops, setCrops] = useState<Crop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFarm, setSelectedFarm] = useState('All Farms');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [cropData, farmData] = await Promise.all([
        cropService.getCrops(user.id),
        farmService.getFarms(user.id),
      ]);
      setCrops(cropData);
      setFarms(farmData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const filteredCrops = crops.filter((c) => {
    const matchesSearch =
      c.cropName.toLowerCase().includes(search.toLowerCase()) ||
      c.farmName.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchesFarm = selectedFarm === 'All Farms' || c.farmId === selectedFarm;
    const matchesStatus = selectedStatus === 'All Statuses' || c.status === selectedStatus;
    return matchesSearch && matchesFarm && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);
  const paginatedCrops = filteredCrops.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await cropService.deleteCrop(deleteTargetId);
      showToast('Crop log deleted successfully', 'info');
      setDeleteTargetId(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete crop', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Crop Tracking</h1>
          <p className="text-xs text-slate-500">Monitor cultivation stages from planting to ready-for-harvest.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/farmer/crops/new')}
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          Add New Crop Log
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search crop name or farm..." />
        </div>
        <div className="sm:col-span-3">
          <Select
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
            options={[
              { value: 'All Farms', label: 'All Farms' },
              ...farms.map((f) => ({ value: f.id, label: f.name })),
            ]}
          />
        </div>
        <div className="sm:col-span-3">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              'All Statuses',
              'PLANNED',
              'PLANTED',
              'GROWING',
              'READY_FOR_HARVEST',
              'HARVESTED',
            ]}
          />
        </div>
      </div>

      {/* Content Table / Cards */}
      {isLoading ? (
        <LoadingSpinner fullPage={false} message="Loading crop stages..." />
      ) : filteredCrops.length === 0 ? (
        <EmptyState
          icon={<Sprout className="w-10 h-10" />}
          title="No Crop Records"
          description={search || selectedFarm !== 'All Farms' ? "No crops match your active search filters." : "You haven't logged any active crops yet."}
          actionText={search ? "Clear Search" : "Log First Crop"}
          onAction={search ? () => setSearch('') : () => navigate('/farmer/crops/new')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-3">Crop Name</th>
                  <th className="pb-3">Farm</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Planting Date</th>
                  <th className="pb-3">Expected Harvest</th>
                  <th className="pb-3">Estimated Yield</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCrops.map((crop) => (
                  <tr key={crop.id} className="hover:bg-slate-50">
                    <td className="py-4 font-bold text-slate-900">{crop.cropName}</td>
                    <td className="py-4 text-slate-700 font-medium">{crop.farmName}</td>
                    <td className="py-4 text-slate-500">{crop.category}</td>
                    <td className="py-4 text-slate-600">{crop.plantingDate}</td>
                    <td className="py-4 font-semibold text-slate-900">{crop.expectedHarvestDate}</td>
                    <td className="py-4 font-extrabold text-emerald-700">{crop.quantity} {crop.unit}</td>
                    <td className="py-4">
                      <CropStatusBadge status={crop.status} />
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setDeleteTargetId(crop.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Crop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            totalItems={filteredCrops.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Crop Log"
        message="Are you sure you want to remove this crop record?"
        isLoading={isDeleting}
      />
    </div>
  );
};
