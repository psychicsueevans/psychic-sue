'use client';

import React, { useState, useEffect } from 'react';
import { announcementService } from '@/services/announcementService';
import type { Announcement, InsertAnnouncement, UpdateAnnouncement } from '@/types/admin.types';

export default function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [announcementForm, setAnnouncementForm] = useState<InsertAnnouncement>({
    title: '',
    content: '',
    delivery_method: 'both',
    target_tier: 'all',
    is_published: false
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    const { data, error: err } = await announcementService.getAllAnnouncements();
    if (err) {
      setError(err.message);
    } else {
      setAnnouncements(data || []);
    }
    setLoading(false);
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: err } = await announcementService.createAnnouncement(announcementForm);
    if (err) {
      setError(err.message);
    } else {
      setShowAnnouncementForm(false);
      resetForm();
      loadAnnouncements();
    }
  };

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement) return;
    
    const updates: UpdateAnnouncement = {
      title: announcementForm.title,
      content: announcementForm.content,
      delivery_method: announcementForm.delivery_method,
      target_tier: announcementForm.target_tier,
      is_published: announcementForm.is_published
    };

    const { error: err } = await announcementService.updateAnnouncement(editingAnnouncement.id, updates);
    if (err) {
      setError(err.message);
    } else {
      setEditingAnnouncement(null);
      setShowAnnouncementForm(false);
      resetForm();
      loadAnnouncements();
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    const { error: err } = await announcementService.deleteAnnouncement(id);
    if (err) {
      setError(err.message);
    } else {
      loadAnnouncements();
    }
  };

  const handleTogglePublish = async (announcement: Announcement) => {
    const { error: err } = announcement.is_published
      ? await announcementService.unpublishAnnouncement(announcement.id)
      : await announcementService.publishAnnouncement(announcement.id);
    
    if (err) {
      setError(err.message);
    } else {
      loadAnnouncements();
    }
  };

  const handleMarkAsSent = async (id: string) => {
    const { error: err } = await announcementService.markAsSent(id);
    if (err) {
      setError(err.message);
    } else {
      loadAnnouncements();
    }
  };

  const startEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      delivery_method: announcement.delivery_method,
      target_tier: announcement.target_tier || 'all',
      is_published: announcement.is_published
    });
    setShowAnnouncementForm(true);
  };

  const resetForm = () => {
    setAnnouncementForm({
      title: '',
      content: '',
      delivery_method: 'both',
      target_tier: 'all',
      is_published: false
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDeliveryMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      email: 'Email Only',
      dashboard: 'Dashboard Only',
      both: 'Email & Dashboard'
    };
    return labels[method] || method;
  };

  const getDeliveryMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      email: 'bg-blue-100 text-blue-800',
      dashboard: 'bg-purple-100 text-purple-800',
      both: 'bg-green-100 text-green-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-12">Loading announcements...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">&times;</button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📢 How Announcements Work</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Email</strong>: Announcement sent to members via email (you must send manually)</li>
          <li>• <strong>Dashboard</strong>: Announcement appears in member dashboard when they log in</li>
          <li>• <strong>Both</strong>: Combines email + dashboard notification for maximum visibility</li>
          <li>• <strong>Target Tier</strong>: Choose which membership tier sees this announcement</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Announcements Manager</h2>
          <button
            onClick={() => {
              setEditingAnnouncement(null);
              resetForm();
              setShowAnnouncementForm(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add Announcement
          </button>
        </div>

        {/* Announcement Form */}
        {showAnnouncementForm && (
          <form onSubmit={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter the full announcement message"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method</label>
              <select
                value={announcementForm.delivery_method}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, delivery_method: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="email">Email Only</option>
                <option value="dashboard">Dashboard Only</option>
                <option value="both">Email & Dashboard (Recommended)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Where should members see this announcement?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select
                value={announcementForm.target_tier}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, target_tier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Members</option>
                <option value="circle_member">Circle Members Only ($35/month)</option>
                <option value="vip">VIP Members Only ($547/6 months)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={announcementForm.is_published}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, is_published: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm text-gray-700">
                Publish immediately (make visible to members)
              </label>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                {editingAnnouncement ? 'Update' : 'Create'} Announcement
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAnnouncementForm(false);
                  setEditingAnnouncement(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements?.map((announcement) => (
            <div key={announcement.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDeliveryMethodColor(announcement.delivery_method)}`}>
                      {getDeliveryMethodLabel(announcement.delivery_method)}
                    </span>
                    {announcement.is_published ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Published</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Draft</span>
                    )}
                    {announcement.is_sent && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Sent</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Target: {announcement.target_tier === 'all' ? 'All Members' : announcement.target_tier === 'circle_member' ? 'Circle Members' : 'VIP Members'}</span>
                    <span>Created: {formatDate(announcement.created_at)}</span>
                    {announcement.sent_at && <span>Sent: {formatDate(announcement.sent_at)}</span>}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleTogglePublish(announcement)}
                    className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {announcement.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  {!announcement.is_sent && announcement.is_published && (
                    <button
                      onClick={() => handleMarkAsSent(announcement.id)}
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Mark as Sent
                    </button>
                  )}
                  <button
                    onClick={() => startEditAnnouncement(announcement)}
                    className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {announcements?.length === 0 && (
            <div className="text-center py-8 text-gray-500">No announcements yet. Click "Add Announcement" to create one.</div>
          )}
        </div>
      </div>
    </div>
  );
}