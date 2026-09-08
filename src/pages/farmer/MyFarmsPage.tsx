import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmService } from '../../services/farmService';
import { Farm } from '../../types';
import { FarmCard } from '../../components/farm/FarmCard';
import { SearchBar } from '../../components/marketplace/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { useNotifications } from '../../context/NotificationContext';
import { Plus, Tractor } from 'lucide-react';

export const MyFarmsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadFarms = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await farmService.getFarms(user.id);
      setFarms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, [user]);

  const filteredFarms = farms.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase()) ||
      f.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFarms.length / itemsPerPage);
  const paginatedFarms = filteredFarms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await farmService.deleteFarm(deleteTargetId);
      showToast('Farm record deleted successfully', 'info');
      setDeleteTargetId(null);
      loadFarms();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete farm', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Registered Farms</h1>
          <p className="text-xs text-slate-500">Overview of your agricultural land units and soil locations in Sri Lanka.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/farmer/farms/new')}
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          Add New Farm
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search farms by name, district, or city..." />
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner fullPage={false} message="Loading your farms..." />
      ) : filteredFarms.length === 0 ? (
        <EmptyState
          icon={<Tractor className="w-10 h-10" />}
          title="No Farms Registered"
          description={search ? "No farms matched your search criteria." : "You haven't added any farms yet. Register your land to start managing crops and produce."}
          actionText={search ? "Clear Search" : "Register First Farm"}
          onAction={search ? () => setSearch('') : () => navigate('/farmer/farms/new')}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedFarms.map((farm) => (
              <FarmCard
                key={farm.id}
                farm={farm}
                onDelete={(id) => setDeleteTargetId(id)}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredFarms.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Farm Record"
        message="Are you sure you want to delete this farm? Associated crop records will remain unlinked."
        confirmText="Delete Farm"
        isLoading={isDeleting}
      />
    </div>
  );
};
