'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Module {
  id: number;
  title: string;
  lessons: number;
  duration: string;
  published: boolean;
}

const CourseModuleSection = () => {
  const [showAddModule, setShowAddModule] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [lessonCount, setLessonCount] = useState('');

  const modules: Module[] = [
    { id: 1, title: 'Introduction to Tarot Fundamentals', lessons: 8, duration: '2h 30m', published: true },
    { id: 2, title: 'Understanding the Major Arcana', lessons: 12, duration: '3h 15m', published: true },
    { id: 3, title: 'Exploring the Minor Arcana', lessons: 16, duration: '4h 00m', published: true },
    { id: 4, title: 'Spreads and Reading Techniques', lessons: 10, duration: '3h 45m', published: true },
    { id: 5, title: 'Intuitive Development Practices', lessons: 9, duration: '2h 50m', published: false },
  ];

  const handleAddModule = () => {
    if (!moduleTitle || !lessonCount) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Adding module:', { moduleTitle, moduleDescription, lessonCount });
    setModuleTitle('');
    setModuleDescription('');
    setLessonCount('');
    setShowAddModule(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Course Modules</h3>
        <button
          onClick={() => setShowAddModule(!showAddModule)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 active:scale-95"
        >
          <Icon name={showAddModule ? 'XMarkIcon' : 'PlusIcon'} size={18} />
          <span>{showAddModule ? 'Cancel' : 'Add Module'}</span>
        </button>
      </div>

      {showAddModule && (
        <div className="bg-muted/30 rounded-lg p-6 border border-border animate-slide-down">
          <h4 className="text-md font-semibold text-foreground mb-4">Create New Module</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="module-title" className="block text-sm font-medium text-foreground mb-2">
                Module Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="module-title"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                placeholder="e.g., Advanced Interpretation Methods"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="module-description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                id="module-description"
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                rows={3}
                placeholder="Describe what students will learn in this module..."
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label htmlFor="lesson-count" className="block text-sm font-medium text-foreground mb-2">
                Number of Lessons <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="lesson-count"
                value={lessonCount}
                onChange={(e) => setLessonCount(e.target.value)}
                placeholder="e.g., 10"
                min="1"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              onClick={handleAddModule}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 active:scale-95"
            >
              <Icon name="PlusCircleIcon" size={20} />
              <span>Create Module</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {modules.map((module) => (
          <div key={module.id} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:shadow-sm transition-all duration-250">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name="AcademicCapIcon" size={20} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-foreground">{module.title}</p>
                  {module.published ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {module.lessons} lessons • {module.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-250">
                <Icon name="PencilIcon" size={18} />
              </button>
              <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-all duration-250">
                <Icon name="EyeIcon" size={18} />
              </button>
              <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-all duration-250">
                <Icon name="TrashIcon" size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseModuleSection;