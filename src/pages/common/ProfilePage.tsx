import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SRI_LANKA_DISTRICTS } from '../../types';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { useNotifications } from '../../context/NotificationContext';
import { User as UserIcon, Mail, Phone, MapPin, Lock, Edit2, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotifications();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    district: user?.district || 'Nuwara Eliya',
    address: user?.address || '',
  });

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser(formData);
      showToast('Profile information updated successfully!', 'success');
      setIsEditing(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-700 text-white font-extrabold text-2xl flex items-center justify-center border-4 border-emerald-100 shadow-md">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.firstName.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user.firstName} {user.lastName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user.email} • District: {user.district}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit Profile
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
          <Link to="/profile/change-password">
            <Button variant="secondary" size="sm" leftIcon={<Lock className="w-3.5 h-3.5" />}>
              Change Password
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Personal Account Information</h3>
            <p className="text-xs text-slate-500">Your profile contact info shown on orders and listings.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Home District"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              options={[...SRI_LANKA_DISTRICTS]}
              disabled={!isEditing}
            />
            <Input
              label="Full Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!isEditing}
              leftIcon={<MapPin className="w-4 h-4" />}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="ghost" type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" isLoading={isSaving} className="bg-emerald-700 hover:bg-emerald-800">
                Save Profile Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
