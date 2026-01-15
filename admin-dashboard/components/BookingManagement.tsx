'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Booking {
  id: string;
  memberName: string;
  type: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  amount: string;
  notes?: string;
}

const BookingManagement = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const bookings: Booking[] = [
    {
      id: '1',
      memberName: 'Sarah Johnson',
      type: 'Deep Dive Reading',
      date: '15/01/2026',
      time: '14:00',
      status: 'Confirmed',
      amount: '$150',
      notes: 'Focus on career transition and relationship clarity',
    },
    {
      id: '2',
      memberName: 'Emma Wilson',
      type: 'Standard Reading',
      date: '16/01/2026',
      time: '10:30',
      status: 'Confirmed',
      amount: '$75',
    },
    {
      id: '3',
      memberName: 'Michael Brown',
      type: 'Quick Insight',
      date: '17/01/2026',
      time: '16:00',
      status: 'Pending',
      amount: '$35',
    },
    {
      id: '4',
      memberName: 'Lisa Anderson',
      type: 'Deep Dive Reading',
      date: '10/01/2026',
      time: '11:00',
      status: 'Completed',
      amount: '$150',
      notes: 'Excellent session, member very satisfied',
    },
    {
      id: '5',
      memberName: 'David Thompson',
      type: 'Standard Reading',
      date: '08/01/2026',
      time: '15:30',
      status: 'Completed',
      amount: '$75',
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Completed':
        return 'bg-success/10 text-success border-success/20';
      case 'Cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status === 'Completed')
    .reduce((sum, b) => sum + parseFloat(b.amount.replace('$', '')), 0);

  const upcomingCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-muted-foreground">Upcoming Bookings</h3>
            <Icon name="CalendarIcon" size={20} className="text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{upcomingCount}</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-muted-foreground">Completed This Month</h3>
            <Icon name="CheckCircleIcon" size={20} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground">{bookings.filter((b) => b.status === 'Completed').length}</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-muted-foreground">Total Revenue</h3>
            <Icon name="CurrencyPoundIcon" size={20} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground">${totalRevenue.toFixed(0)}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Booking History</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Member</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Reading Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date & Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border hover:bg-muted/50 transition-all duration-250">
                  <td className="py-4 px-4">
                    <p className="font-medium text-foreground">{booking.memberName}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">{booking.type}</td>
                  <td className="py-4 px-4 text-sm text-foreground">
                    {booking.date} at {booking.time}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-foreground">{booking.amount}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-250">
                        <Icon name="EyeIcon" size={18} />
                      </button>
                      <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-all duration-250">
                        <Icon name="PencilIcon" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;