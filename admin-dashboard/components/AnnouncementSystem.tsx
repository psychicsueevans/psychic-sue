'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Announcement {
  id: string;
  title: string;
  message: string;
  recipients: string;
  sentDate: string;
  status: 'Sent' | 'Scheduled' | 'Draft';
}

const AnnouncementSystem = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientGroup, setRecipientGroup] = useState('all');
  const [scheduleDate, setScheduleDate] = useState('');

  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'New Course Module Available',
      message: 'Module 5: Intuitive Development Practices is now live! Access it from your dashboard.',
      recipients: 'All Members',
      sentDate: '05/01/2026',
      status: 'Sent',
    },
    {
      id: '2',
      title: 'Weekly Energy Update',
      message: "This week's energy focuses on transformation and new beginnings. Perfect time for clarity readings.",
      recipients: 'All Members',
      sentDate: '03/01/2026',
      status: 'Sent',
    },
    {
      id: '3',
      title: 'Special Offer - Deep Dive Readings',
      message: '20% off Deep Dive Readings this month for Platinum members.',
      recipients: 'Platinum Members',
      sentDate: '01/01/2026',
      status: 'Sent',
    },
  ];

  const handleSendAnnouncement = () => {
    if (!title || !message) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Sending announcement:', { title, message, recipientGroup, scheduleDate });
    setTitle('');
    setMessage('');
    setRecipientGroup('all');
    setScheduleDate('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center space-x-2">
          <Icon name="MegaphoneIcon" size={28} className="text-primary" />
          <span>Send Announcement</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="announcement-title" className="block text-sm font-medium text-foreground mb-2">
              Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="announcement-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New Course Module Available"
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="announcement-message" className="block text-sm font-medium text-foreground mb-2">
              Message <span className="text-error">*</span>
            </label>
            <textarea
              id="announcement-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Write your announcement message here..."
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipient-group" className="block text-sm font-medium text-foreground mb-2">
                Recipients
              </label>
              <select
                id="recipient-group"
                value={recipientGroup}
                onChange={(e) => setRecipientGroup(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Members</option>
                <option value="platinum">Platinum Members</option>
                <option value="gold">Gold Members</option>
                <option value="silver">Silver Members</option>
                <option value="active">Active Members Only</option>
              </select>
            </div>

            <div>
              <label htmlFor="schedule-date" className="block text-sm font-medium text-foreground mb-2">
                Schedule (Optional)
              </label>
              <input
                type="datetime-local"
                id="schedule-date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg">
            <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              {recipientGroup === 'all' ?'This announcement will be sent to all 247 members.'
                : `This announcement will be sent to ${recipientGroup} members.`}
              {scheduleDate && ' It will be sent at the scheduled time.'}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSendAnnouncement}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 active:scale-95"
            >
              <Icon name="PaperAirplaneIcon" size={20} />
              <span>{scheduleDate ? 'Schedule Announcement' : 'Send Now'}</span>
            </button>
            <button className="px-6 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-all duration-250">
              Save as Draft
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4">Recent Announcements</h3>
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="p-4 bg-muted/30 rounded-lg border border-border hover:shadow-sm transition-all duration-250">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-foreground">{announcement.title}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                      {announcement.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{announcement.message}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="UsersIcon" size={14} />
                      <span>{announcement.recipients}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="CalendarIcon" size={14} />
                      <span>{announcement.sentDate}</span>
                    </span>
                  </div>
                </div>
                <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-all duration-250">
                  <Icon name="EllipsisVerticalIcon" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSystem;