'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import MetricsOverview from './MetricsOverview';
import MemberManagement from './MemberManagement';
import ContentManagement from './ContentManagement';
import AnnouncementSystem from './AnnouncementSystem';
import BookingManagement from './BookingManagement';

type AdminTab = 'overview' | 'members' | 'content' | 'announcements' | 'bookings';

const AdminDashboardInteractive = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const tabs = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: 'ChartBarIcon' },
    { id: 'members' as AdminTab, label: 'Members', icon: 'UsersIcon' },
    { id: 'content' as AdminTab, label: 'Content', icon: 'FolderIcon' },
    { id: 'announcements' as AdminTab, label: 'Announcements', icon: 'MegaphoneIcon' },
    { id: 'bookings' as AdminTab, label: 'Bookings', icon: 'CalendarIcon' },
  ];

  return (
    <div className="mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-2">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl shadow-md">
            <Icon name="ShieldCheckIcon" size={28} className="text-white" variant="solid" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage The Psychic Circle Platform</p>
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 border-b border-border pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg font-medium transition-all duration-250 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab.icon as any} size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-in">
        {activeTab === 'overview' && <MetricsOverview />}
        {activeTab === 'members' && <MemberManagement />}
        {activeTab === 'content' && <ContentManagement />}
        {activeTab === 'announcements' && <AnnouncementSystem />}
        {activeTab === 'bookings' && <BookingManagement />}
      </div>
    </div>
  );
};

export default AdminDashboardInteractive;