'use client';

import React, { useState, useEffect } from 'react';
import { resourceService } from '@/services/resourceService';
import type { Resource, InsertResource, ResourceCategory } from '@/types/admin.types';

const CATEGORIES: ResourceCategory[] = ['journals', 'guides', 'workbooks', 'reference'];

export default function ResourcesManager() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [filterCategory, setFilterCategory] = useState<ResourceCategory | 'all'>('all');

  const [formData, setFormData] = useState<InsertResource>({
    title: '',
    description: '',
    file_url: '',
    file_size: 0,
    category: 'guides',
    is_featured: false,
    is_published: false
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    const { data, error: err } = await resourceService.getAllResources();
    if (err) {
      setError(err.message);
    } else {
      setResources(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResource) {
      const { error: err } = await resourceService.updateResource(editingResource.id, formData);
      if (err) {
        setError(err.message);
      } else {
        setShowForm(false);
        setEditingResource(null);
        resetForm();
        loadResources();
      }
    } else {
      const { error: err } = await resourceService.createResource(formData);
      if (err) {
        setError(err.message);
      } else {
        setShowForm(false);
        resetForm();
        loadResources();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    const { error: err } = await resourceService.deleteResource(id);
    if (err) {
      setError(err.message);
    } else {
      loadResources();
    }
  };

  const handleTogglePublished = async (resource: Resource) => {
    const { error: err } = await resourceService.togglePublished(resource.id, !resource.is_published);
    if (err) {
      setError(err.message);
    } else {
      loadResources();
    }
  };

  const handleToggleFeatured = async (resource: Resource) => {
    const { error: err } = await resourceService.toggleFeatured(resource.id, !resource.is_featured);
    if (err) {
      setError(err.message);
    } else {
      loadResources();
    }
  };

  const startEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description || '',
      file_url: resource.file_url,
      file_size: resource.file_size || 0,
      category: resource.category,
      is_featured: resource.is_featured,
      is_published: resource.is_published
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      file_url: '',
      file_size: 0,
      category: 'guides',
      is_featured: false,
      is_published: false
    });
    setEditingResource(null);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const filteredResources = filterCategory === 'all'
    ? resources
    : resources?.filter((r) => r.category === filterCategory);

  if (loading) {
    return <div className="text-center py-12">Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">&times;</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resources</h2>
            <p className="text-sm text-gray-600 mt-1">Manage downloadable resources library</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add Resource
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filterCategory === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {CATEGORIES?.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                filterCategory === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">{editingResource ? 'Edit Resource' : 'New Resource'}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
              <input
                type="url"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://example.com/files/resource.pdf"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Size (bytes)</label>
              <input
                type="number"
                value={formData.file_size}
                onChange={(e) => setFormData({ ...formData, file_size: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Optional: File size in bytes for display</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ResourceCategory })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                {CATEGORIES?.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm text-gray-700">Featured</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm text-gray-700">Published</label>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                {editingResource ? 'Update' : 'Create'} Resource
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingResource(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Resources List */}
        <div className="space-y-3">
          {filteredResources?.map((resource) => (
            <div key={resource.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded capitalize">
                      {resource.category}
                    </span>
                    {resource.is_featured && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">⭐ Featured</span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded ${
                      resource.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {resource.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-gray-500">{formatFileSize(resource.file_size)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  <p className="text-xs text-purple-600 mt-2 truncate">{resource.file_url}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleTogglePublished(resource)}
                    className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {resource.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(resource)}
                    className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                  >
                    {resource.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => startEdit(resource)}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredResources?.length === 0 && (
            <p className="text-center text-gray-500 py-8">No resources found. Click "Add Resource" to create one.</p>
          )}
        </div>
      </div>
    </div>
  );
}