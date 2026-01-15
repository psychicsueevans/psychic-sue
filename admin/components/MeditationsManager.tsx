'use client';

import React, { useState, useEffect } from 'react';
import { meditationService } from '@/services/meditationService';
import type { Meditation, InsertMeditation, MeditationCategory } from '@/types/admin.types';

const CATEGORIES: MeditationCategory[] = ['relaxation', 'intuition', 'protection', 'sleep'];

export default function MeditationsManager() {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMeditation, setEditingMeditation] = useState<Meditation | null>(null);
  const [filterCategory, setFilterCategory] = useState<MeditationCategory | 'all'>('all');

  const [formData, setFormData] = useState<InsertMeditation>({
    title: '',
    description: '',
    audio_url: '',
    duration_minutes: 10,
    category: 'relaxation',
    is_featured: false,
    is_published: false
  });

  useEffect(() => {
    loadMeditations();
  }, []);

  const loadMeditations = async () => {
    setLoading(true);
    const { data, error: err } = await meditationService.getAllMeditations();
    if (err) {
      setError(err.message);
    } else {
      setMeditations(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMeditation) {
      const { error: err } = await meditationService.updateMeditation(editingMeditation.id, formData);
      if (err) {
        setError(err.message);
      } else {
        setShowForm(false);
        setEditingMeditation(null);
        resetForm();
        loadMeditations();
      }
    } else {
      const { error: err } = await meditationService.createMeditation(formData);
      if (err) {
        setError(err.message);
      } else {
        setShowForm(false);
        resetForm();
        loadMeditations();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meditation?')) return;
    const { error: err } = await meditationService.deleteMeditation(id);
    if (err) {
      setError(err.message);
    } else {
      loadMeditations();
    }
  };

  const handleTogglePublished = async (meditation: Meditation) => {
    const { error: err } = await meditationService.togglePublished(meditation.id, !meditation.is_published);
    if (err) {
      setError(err.message);
    } else {
      loadMeditations();
    }
  };

  const handleToggleFeatured = async (meditation: Meditation) => {
    const { error: err } = await meditationService.toggleFeatured(meditation.id, !meditation.is_featured);
    if (err) {
      setError(err.message);
    } else {
      loadMeditations();
    }
  };

  const startEdit = (meditation: Meditation) => {
    setEditingMeditation(meditation);
    setFormData({
      title: meditation.title,
      description: meditation.description || '',
      audio_url: meditation.audio_url,
      duration_minutes: meditation.duration_minutes || 10,
      category: meditation.category,
      is_featured: meditation.is_featured,
      is_published: meditation.is_published
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      audio_url: '',
      duration_minutes: 10,
      category: 'relaxation',
      is_featured: false,
      is_published: false
    });
    setEditingMeditation(null);
  };

  const filteredMeditations = filterCategory === 'all'
    ? meditations
    : meditations?.filter((m) => m.category === filterCategory);

  if (loading) {
    return <div className="text-center py-12">Loading meditations...</div>;
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
            <h2 className="text-2xl font-bold text-gray-900">Meditations</h2>
            <p className="text-sm text-gray-600 mt-1">Manage meditation audio library</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add Meditation
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
            <h3 className="text-lg font-semibold">{editingMeditation ? 'Edit Meditation' : 'New Meditation'}</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Audio URL</label>
              <input
                type="url"
                value={formData.audio_url}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://example.com/audio/meditation.mp3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as MeditationCategory })}
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
                {editingMeditation ? 'Update' : 'Create'} Meditation
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMeditation(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Meditations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeditations?.map((meditation) => (
            <div key={meditation.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded capitalize">
                    {meditation.category}
                  </span>
                  {meditation.is_featured && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">⭐ Featured</span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded ${
                    meditation.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {meditation.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{meditation.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{meditation.description}</p>
                {meditation.duration_minutes && (
                  <p className="text-xs text-gray-500 mt-2">{meditation.duration_minutes} minutes</p>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleTogglePublished(meditation)}
                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  {meditation.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleToggleFeatured(meditation)}
                  className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                >
                  {meditation.is_featured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  onClick={() => startEdit(meditation)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(meditation.id)}
                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredMeditations?.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No meditations found. Click "Add Meditation" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}