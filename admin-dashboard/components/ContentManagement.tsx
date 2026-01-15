'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AudioUploadSection from './AudioUploadSection';
import CourseModuleSection from './CourseModuleSection';

type ContentTab = 'audio' | 'courses';

const ContentManagement = () => {
  const [activeContentTab, setActiveContentTab] = useState<ContentTab>('audio');

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Content Management</h2>

        <div className="flex space-x-2 border-b border-border mb-6">
          <button
            onClick={() => setActiveContentTab('audio')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg font-medium transition-all duration-250 ${
              activeContentTab === 'audio' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name="MusicalNoteIcon" size={20} />
            <span>Audio Recordings</span>
          </button>
          <button
            onClick={() => setActiveContentTab('courses')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg font-medium transition-all duration-250 ${
              activeContentTab === 'courses' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name="AcademicCapIcon" size={20} />
            <span>Course Modules</span>
          </button>
        </div>

        <div className="animate-fade-in">
          {activeContentTab === 'audio' && <AudioUploadSection />}
          {activeContentTab === 'courses' && <CourseModuleSection />}
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;