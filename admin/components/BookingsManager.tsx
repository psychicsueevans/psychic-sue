'use client';

import React, { useState, useEffect } from 'react';
import { bookingService } from '@/services/bookingService';
import { memberService } from '@/services/memberService';
import type { Booking, InsertBooking, UpdateBooking, Member, ReadingHistory } from '@/types/admin.types';

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const [bookingForm, setBookingForm] = useState<InsertBooking>({
    member_id: '',
    reading_type: 'general',
    booking_date: new Date().toISOString().slice(0, 16),
    status: 'pending',
    customer_questions: '',
    special_requests: '',
    payment_amount: 0
  });

  useEffect(() => {
    loadBookings();
    loadMembers();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const { data, error: err } = await bookingService.getAllBookings();
    if (err) {
      setError(err.message);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const loadMembers = async () => {
    const { data, error: err } = await memberService.getAllMembers();
    if (err) {
      setError(err.message);
    } else {
      setMembers(data || []);
    }
  };

  const loadReadingHistory = async (memberId: string) => {
    const { data, error: err } = await bookingService.getReadingHistoryByMemberId(memberId);
    if (err) {
      setError(err.message);
    } else {
      setReadingHistory(data || []);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: err } = await bookingService.createBooking(bookingForm);
    if (err) {
      setError(err.message);
    } else {
      setShowBookingForm(false);
      resetForm();
      loadBookings();
    }
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    
    const updates: UpdateBooking = {
      reading_type: bookingForm.reading_type,
      booking_date: bookingForm.booking_date,
      status: bookingForm.status,
      customer_questions: bookingForm.customer_questions,
      special_requests: bookingForm.special_requests,
      payment_amount: bookingForm.payment_amount
    };

    const { error: err } = await bookingService.updateBooking(editingBooking.id, updates);
    if (err) {
      setError(err.message);
    } else {
      setEditingBooking(null);
      setShowBookingForm(false);
      resetForm();
      loadBookings();
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    const { error: err } = await bookingService.deleteBooking(id);
    if (err) {
      setError(err.message);
    } else {
      loadBookings();
    }
  };

  const startEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setBookingForm({
      member_id: booking.member_id,
      reading_type: booking.reading_type,
      booking_date: new Date(booking.booking_date).toISOString().slice(0, 16),
      status: booking.status,
      customer_questions: booking.customer_questions || '',
      special_requests: booking.special_requests || '',
      payment_amount: booking.payment_amount || 0
    });
    setShowBookingForm(true);
  };

  const viewBookingDetails = async (booking: Booking) => {
    setSelectedBooking(booking);
    await loadReadingHistory(booking.member_id);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setBookingForm({
      member_id: '',
      reading_type: 'general',
      booking_date: new Date().toISOString().slice(0, 16),
      status: 'pending',
      customer_questions: '',
      special_requests: '',
      payment_amount: 0
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getReadingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      express: 'Express Reading',
      general: 'General Reading',
      love_relationships: 'Love & Relationships',
      money_career: 'Money & Career',
      in_depth: 'Full In-Depth Reading',
      live_phone: 'Live Phone Reading'
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="text-center py-12">Loading bookings...</div>;
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
          <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
          <button
            onClick={() => {
              setEditingBooking(null);
              resetForm();
              setShowBookingForm(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add Booking
          </button>
        </div>

        {/* Booking Form */}
        {showBookingForm && (
          <form onSubmit={editingBooking ? handleUpdateBooking : handleCreateBooking} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">{editingBooking ? 'Edit Booking' : 'New Booking'}</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member</label>
              <select
                value={bookingForm.member_id}
                onChange={(e) => setBookingForm({ ...bookingForm, member_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
                disabled={!!editingBooking}
              >
                <option value="">Select a member</option>
                {members?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reading Type</label>
              <select
                value={bookingForm.reading_type}
                onChange={(e) => setBookingForm({ ...bookingForm, reading_type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="express">Express Reading ($35)</option>
                <option value="general">General Reading ($50)</option>
                <option value="love_relationships">Love & Relationships ($75)</option>
                <option value="money_career">Money & Career ($75)</option>
                <option value="in_depth">Full In-Depth Reading ($125)</option>
                <option value="live_phone">Live Phone Reading ($150)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date & Time</label>
              <input
                type="datetime-local"
                value={bookingForm.booking_date}
                onChange={(e) => setBookingForm({ ...bookingForm, booking_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={bookingForm.status}
                onChange={(e) => setBookingForm({ ...bookingForm, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Questions</label>
              <textarea
                value={bookingForm.customer_questions}
                onChange={(e) => setBookingForm({ ...bookingForm, customer_questions: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="What questions does the customer have?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
              <textarea
                value={bookingForm.special_requests}
                onChange={(e) => setBookingForm({ ...bookingForm, special_requests: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Any special requests or notes?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={bookingForm.payment_amount}
                onChange={(e) => setBookingForm({ ...bookingForm, payment_amount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                {editingBooking ? 'Update' : 'Create'} Booking
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBookingForm(false);
                  setEditingBooking(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reading Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings?.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.members?.full_name}</div>
                    <div className="text-sm text-gray-500">{booking.members?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getReadingTypeLabel(booking.reading_type)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(booking.booking_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${booking.payment_amount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewBookingDetails(booking)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => startEditBooking(booking)}
                        className="text-purple-600 hover:text-purple-800"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings?.length === 0 && (
            <div className="text-center py-8 text-gray-500">No bookings found. Click "Add Booking" to create one.</div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Customer Questions:</h4>
                <p className="text-gray-600">{selectedBooking.customer_questions || 'No questions provided'}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Special Requests:</h4>
                <p className="text-gray-600">{selectedBooking.special_requests || 'No special requests'}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Reading History:</h4>
                {readingHistory?.length > 0 ? (
                  <div className="space-y-2">
                    {readingHistory.map((history) => (
                      <div key={history.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{getReadingTypeLabel(history.reading_type)}</p>
                            <p className="text-sm text-gray-600">{formatDate(history.reading_date)}</p>
                          </div>
                        </div>
                        {history.notes && (
                          <p className="text-sm text-gray-600 mt-2">{history.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No previous readings found</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}