import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { userService } from '../../services/userService';
import { User, UserRole, UserStatus } from '../../types';
import { SearchBar } from '../../components/marketplace/SearchBar';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { useNotifications } from '../../context/NotificationContext';
import { Users, UserCheck, UserX, Shield, Tractor } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRoleParam = searchParams.get('role') || 'All Roles';
  const { showToast } = useNotifications();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState(initialRoleParam);
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isLoading, setIsLoading] = useState(true);

  // Status toggle modal state
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.district.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'All Roles' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'All Statuses' || u.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleToggleStatus = async () => {
    if (!targetUser) return;
    const nextStatus: UserStatus = targetUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setIsUpdatingStatus(true);
    try {
      await userService.updateUserStatus(targetUser.id, nextStatus);
      showToast(`User account status updated to ${nextStatus}`, 'success');
      setTargetUser(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.message || 'Failed to update user status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h1 className="text-2xl font-extrabold text-slate-900">User Management Portal</h1>
        <p className="text-xs text-slate-500">Manage registered Sri Lankan farmers, buyers, and administrators.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search user name, email, or district..." />
        </div>
        <div className="sm:col-span-3">
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={['All Roles', 'FARMER', 'BUYER', 'ADMIN']}
          />
        </div>
        <div className="sm:col-span-3">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={['All Statuses', 'ACTIVE', 'SUSPENDED']}
          />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <LoadingSpinner fullPage={false} message="Loading platform users..." />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10" />}
          title="No Users Found"
          description="No user accounts match your active search filters."
          actionText="Clear Filters"
          onAction={() => { setSearch(''); setSelectedRole('All Roles'); setSelectedStatus('All Statuses'); }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-3">User Profile</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">District</th>
                  <th className="pb-3">Registered Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center border border-emerald-300">
                          {u.firstName.charAt(0)}
                        </div>
                        <div>
                          <strong className="font-bold text-slate-900 block">{u.firstName} {u.lastName}</strong>
                          <span className="text-[11px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-600">{u.phone}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600 font-medium">{u.district}</td>
                    <td className="py-3.5 text-slate-400">{u.registeredAt}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {u.role !== 'ADMIN' && (
                        <Button
                          variant={u.status === 'ACTIVE' ? 'outline' : 'primary'}
                          size="sm"
                          onClick={() => setTargetUser(u)}
                          className={u.status === 'ACTIVE' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'bg-emerald-700'}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </Button>
                      )}
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
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!targetUser}
        onClose={() => setTargetUser(null)}
        onConfirm={handleToggleStatus}
        title={targetUser?.status === 'ACTIVE' ? 'Suspend User Account' : 'Activate User Account'}
        message={`Are you sure you want to ${targetUser?.status === 'ACTIVE' ? 'suspend' : 'activate'} user account for ${targetUser?.firstName} ${targetUser?.lastName}?`}
        confirmText={targetUser?.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
        isDanger={targetUser?.status === 'ACTIVE'}
        isLoading={isUpdatingStatus}
      />
    </div>
  );
};
