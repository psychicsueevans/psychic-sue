'use client';

import React, { useState, useEffect } from 'react';
import { digitalReadingService } from '@/services/digitalReadingService';
import type { DigitalReading, InsertDigitalReading, ReadingCategory } from '@/types/admin.types';

const CATEGORIES: ReadingCategory[] = ['love_relationships', 'general'];

export default function DigitalReadingsManager() {
  const [readings, setReadings] = useState<DigitalReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReading, setEditingReading] = useState<DigitalReading | null>(null);
  const [filterCategory, setFilterCategory] = useState<ReadingCategory | 'all'>('all');

  const [formData, setFormData] = useState<InsertDigitalReading>({
    category: 'general',
    card_number: 0,
    card_name: '',
    card_meaning: '',
    video_url: ''
  });

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    setLoading(true);
    const { data, error: err } = await digitalReadingService.getAllReadings();
    if (err) {
      setError(err.message);
    } else {
      setReadings(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReading) {
      const { error: err } = await digitalReadingService.updateReading(editingReading.id, formData);
      if (err) {
        setError(err.message);
      } else {
        setShowForm(false);
        setEditingReading(null);
        resetForm();
        loadReadings();
      }
    } else {
      const { error: err } = await digitalReadingService.createReading(formData);
      if (err) {
        setError(err.message);
      } else {
        setShowForm(false);
        resetForm();
        loadReadings();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reading?')) return;
    const { error: err } = await digitalReadingService.deleteReading(id);
    if (err) {
      setError(err.message);
    } else {
      loadReadings();
    }
  };

  const startEdit = (reading: DigitalReading) => {
    setEditingReading(reading);
    setFormData({
      category: reading.category,
      card_number: reading.card_number,
      card_name: reading.card_name,
      card_meaning: reading.card_meaning || '',
      video_url: reading.video_url
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      category: 'general',
      card_number: 0,
      card_name: '',
      card_meaning: '',
      video_url: ''
    });
    setEditingReading(null);
  };

  const filteredReadings = filterCategory === 'all'
    ? readings
    : readings?.filter((r) => r.category === filterCategory);

  if (loading) {
    return <div className="text-center py-12">Loading readings...</div>;
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
            <h2 className="text-2xl font-bold text-gray-900">Digital Card Readings</h2>
            <p className="text-sm text-gray-600 mt-1">Manage card readings (0-21) by category</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add Reading
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
          <button
            onClick={() => setFilterCategory('love_relationships')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filterCategory === 'love_relationships' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Love & Relationships
          </button>
          <button
            onClick={() => setFilterCategory('general')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filterCategory === 'general' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            General
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">{editingReading ? 'Edit Reading' : 'New Reading'}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ReadingCategory })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="general">General</option>
                <option value="love_relationships">Love & Relationships</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number (0-21)</label>
              <input
                type="number"
                min="0"
                max="21"
                value={formData.card_number}
                onChange={(e) => setFormData({ ...formData, card_number: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
              <input
                type="text"
                value={formData.card_name}
                onChange={(e) => setFormData({ ...formData, card_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., The Fool, The Magician"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Meaning</label>
              <textarea
                value={formData.card_meaning}
                onChange={(e) => setFormData({ ...formData, card_meaning: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Brief description of what this card represents"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL</label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                {editingReading ? 'Update' : 'Create'} Reading
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingReading(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Readings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReadings?.map((reading) => (
            <div key={reading.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded font-semibold">
                    Card {reading.card_number}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    reading.category === 'love_relationships' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {reading.category === 'love_relationships' ? '💕 Love' : '🔮 General'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{reading.card_name}</h3>
                <p className="text-sm text-gray-600 mt-1">{reading.card_meaning}</p>
                <p className="text-xs text-purple-600 mt-2 truncate">{reading.video_url}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(reading)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(reading.id)}
                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filteredReadings?.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No readings found. Click "Add Reading" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}