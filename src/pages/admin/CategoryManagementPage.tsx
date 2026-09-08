import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { useNotifications } from '../../context/NotificationContext';
import { Layers, Plus, Edit, Trash2 } from 'lucide-react';

export const CategoryManagementPage: React.FC = () => {
  const { showToast } = useNotifications();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSaving(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, name, description);
        showToast('Category updated successfully', 'success');
      } else {
        await categoryService.createCategory(name, description);
        showToast('New category created', 'success');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(deleteTargetId);
      showToast('Category removed', 'info');
      setDeleteTargetId(null);
      loadCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Category Management</h1>
          <p className="text-xs text-slate-500">Configure marketplace product classification categories.</p>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          Create Category
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner fullPage={false} message="Loading categories..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {cat.productCount} Listed Items
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{cat.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(cat)} leftIcon={<Edit className="w-3.5 h-3.5" />}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTargetId(cat.id)}
                  className="text-red-600 hover:bg-red-50"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Traditional Spices"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              className="block w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              placeholder="Describe produce included in this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving} className="bg-emerald-700 hover:bg-emerald-800">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        isLoading={isDeleting}
      />
    </div>
  );
};
