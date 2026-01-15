'use client';

import React, { useState } from 'react';
import CourseManager from './components/CourseManager';
import WeeklyMessagesManager from './components/WeeklyMessagesManager';
import MeditationsManager from './components/MeditationsManager';
import ResourcesManager from './components/ResourcesManager';
import DigitalReadingsManager from './components/DigitalReadingsManager';
import MembersView from './components/MembersView';
import BookingsManager from './components/BookingsManager';
import AnnouncementsManager from './components/AnnouncementsManager';

type TabType = 'courses' | 'messages' | 'meditations' | 'resources' | 'readings' | 'members' | 'bookings' | 'announcements';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('courses');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'courses', label: 'Course Manager', icon: '📚' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'messages', label: 'Weekly Messages', icon: '✉️' },
    { id: 'meditations', label: 'Meditations', icon: '🧘' },
    { id: 'resources', label: 'Resources', icon: '📁' },
    { id: 'readings', label: 'Digital Readings', icon: '🔮' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'members', label: 'Members', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="mt-2 text-sm text-gray-600">Manage all website content from one place</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'courses' && <CourseManager />}
        {activeTab === 'bookings' && <BookingsManager />}
        {activeTab === 'messages' && <WeeklyMessagesManager />}
        {activeTab === 'meditations' && <MeditationsManager />}
        {activeTab === 'resources' && <ResourcesManager />}
        {activeTab === 'readings' && <DigitalReadingsManager />}
        {activeTab === 'announcements' && <AnnouncementsManager />}
        {activeTab === 'members' && <MembersView />}
      </div>
    </div>
  );
}