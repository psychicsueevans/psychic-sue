'use client';

import React, { useState, useEffect } from 'react';
import { weeklyMessageService } from '@/services/weeklyMessageService';
import type { WeeklyMessage, InsertWeeklyMessage } from '@/types/admin.types';

export default function WeeklyMessagesManager() {
  const [messages, setMessages] = useState<WeeklyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState<WeeklyMessage | null>(null);

  const [formData, setFormData] = useState<InsertWeeklyMessage>({
    title: '',
    message_content: '',
    published_date: new Date().toISOString().split('T')[0],
    is_current: false
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const { data, error: err } = await weeklyMessageService.getAllMessages();
    if (err) {
      setError(err.message);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMessage) {
      const { error: err } = await weeklyMessageService.updateMessage(editingMessage.id, formData);
      if (err) {
        setError(err.message);
      } else {
        setShowForm(false);
        setEditingMessage(null);
        resetForm();
        loadMessages();
      }
    } else {
      const { error: err } = await weeklyMessageService.createMessage(formData);
      if (err) {
        setError(err.message);
      } else {
        setShowForm(false);
        resetForm();
        loadMessages();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    const { error: err } = await weeklyMessageService.deleteMessage(id);
    if (err) {
      setError(err.message);
    } else {
      loadMessages();
    }
  };

  const handleSetCurrent = async (id: string) => {
    const { error: err } = await weeklyMessageService.setCurrentMessage(id);
    if (err) {
      setError(err.message);
    } else {
      loadMessages();
    }
  };

  const startEdit = (message: WeeklyMessage) => {
    setEditingMessage(message);
    setFormData({
      title: message.title,
      message_content: message.message_content,
      published_date: new Date(message.published_date).toISOString().split('T')[0],
      is_current: message.is_current
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message_content: '',
      published_date: new Date().toISOString().split('T')[0],
      is_current: false
    });
    setEditingMessage(null);
  };

  if (loading) {
    return <div className="text-center py-12">Loading messages...</div>;
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
            <h2 className="text-2xl font-bold text-gray-900">Weekly Messages</h2>
            <p className="text-sm text-gray-600 mt-1">Manage weekly member communications</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add Message
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">{editingMessage ? 'Edit Message' : 'New Message'}</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
              <textarea
                value={formData.message_content}
                onChange={(e) => setFormData({ ...formData, message_content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Write your message to members here..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
              <input
                type="date"
                value={formData.published_date}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_current}
                onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm text-gray-700">Set as current week message</label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                {editingMessage ? 'Update' : 'Create'} Message
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMessage(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Messages List */}
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`p-4 border rounded-lg ${
                message.is_current ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {message.is_current && (
                      <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full font-semibold">
                        CURRENT WEEK
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(message.published_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{message.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{message.message_content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!message.is_current && (
                    <button
                      onClick={() => handleSetCurrent(message.id)}
                      className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Set Current
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(message)}
                    className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {messages?.length === 0 && (
            <p className="text-center text-gray-500 py-8">No messages yet. Click "Add Message" to create one.</p>
          )}
        </div>
      </div>
    </div>
  );
}