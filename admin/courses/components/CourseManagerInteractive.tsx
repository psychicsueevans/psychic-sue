'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { courseService } from '../../../../services/courseService';
import type { ModuleWithLessons, InsertCourseModule, InsertCourseLesson } from '../../../../types/course.types';

export function CourseManagerInteractive() {
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<ModuleWithLessons | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ id: string; moduleId: string } | null>(null);

  const [moduleForm, setModuleForm] = useState<InsertCourseModule>({
    module_number: 1,
    title: '',
    description: '',
    order_position: 1,
    is_published: false,
  });

  const [lessonForm, setLessonForm] = useState<InsertCourseLesson>({
    module_id: '',
    lesson_number: 1,
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0,
    order_position: 1,
    is_published: false,
    resource_url: '',
    resource_title: '',
  });

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await courseService.getModulesWithLessons();
      if (result.error) throw result.error;
      setModules(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  // Calculate next available module number
  const getNextAvailableModuleNumber = (): number => {
    if (modules.length === 0) return 1;
    
    // Get all existing module numbers
    const existingNumbers = modules.map(m => m.module_number).sort((a, b) => a - b);
    
    // Find the first gap in the sequence, or return the next number
    for (let i = 1; i <= 8; i++) {
      if (!existingNumbers.includes(i)) {
        return i;
      }
    }
    
    // If all 1-8 are taken, return the next available
    return Math.max(...existingNumbers, 0) + 1;
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check if module_number already exists
    const existingModule = modules.find(m => m.module_number === moduleForm.module_number);
    if (existingModule) {
      setError(`Module ${moduleForm.module_number} already exists. Please edit the existing module or choose a different number.`);
      return;
    }

    try {
      const result = await courseService.createModule(moduleForm);
      if (result.error) throw result.error;
      
      await loadModules();
      setShowModuleForm(false);
      
      // Reset form with next available module number
      const nextModuleNumber = getNextAvailableModuleNumber();
      setModuleForm({
        module_number: nextModuleNumber,
        title: '',
        description: '',
        order_position: nextModuleNumber,
        is_published: false,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create module';
      
      // Check for duplicate key error
      if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
        setError(`Module ${moduleForm.module_number} already exists in the database. Please refresh the page or choose a different module number.`);
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;
    setError(null);

    try {
      const result = await courseService.updateModule(editingModule.id, {
        title: moduleForm.title,
        description: moduleForm.description,
      });
      if (result.error) throw result.error;
      
      await loadModules();
      setEditingModule(null);
      setShowModuleForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update module');
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this module? All lessons will be deleted too.')) return;
    setError(null);

    try {
      const result = await courseService.deleteModule(id);
      if (result.error) throw result.error;
      await loadModules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete module');
    }
  };

  const handleToggleModulePublish = async (id: string, currentStatus: boolean) => {
    setError(null);

    try {
      const result = currentStatus
        ? await courseService.unpublishModule(id)
        : await courseService.publishModule(id);
      if (result.error) throw result.error;
      await loadModules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update module status');
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await courseService.createLesson(lessonForm);
      if (result.error) throw result.error;
      
      await loadModules();
      setShowLessonForm(null);
      setLessonForm({
        module_id: '',
        lesson_number: 1,
        title: '',
        description: '',
        video_url: '',
        duration_minutes: 0,
        order_position: 1,
        is_published: false,
        resource_url: '',
        resource_title: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lesson');
    }
  };

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    setError(null);

    try {
      const result = await courseService.updateLesson(editingLesson.id, {
        title: lessonForm.title,
        description: lessonForm.description,
        video_url: lessonForm.video_url,
        duration_minutes: lessonForm.duration_minutes,
        resource_url: lessonForm.resource_url,
        resource_title: lessonForm.resource_title,
      });
      if (result.error) throw result.error;
      
      await loadModules();
      setEditingLesson(null);
      setShowLessonForm(null);
      setLessonForm({
        module_id: '',
        lesson_number: 1,
        title: '',
        description: '',
        video_url: '',
        duration_minutes: 0,
        order_position: 1,
        is_published: false,
        resource_url: '',
        resource_title: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    setError(null);

    try {
      const result = await courseService.deleteLesson(id);
      if (result.error) throw result.error;
      await loadModules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete lesson');
    }
  };

  const handleToggleLessonPublish = async (id: string, currentStatus: boolean) => {
    setError(null);

    try {
      const result = currentStatus
        ? await courseService.unpublishLesson(id)
        : await courseService.publishLesson(id);
      if (result.error) throw result.error;
      await loadModules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lesson status');
    }
  };

  const startEditModule = (module: ModuleWithLessons) => {
    setEditingModule(module);
    setModuleForm({
      module_number: module.module_number,
      title: module.title,
      description: module.description || '',
      order_position: module.order_position,
      is_published: module.is_published,
    });
    setShowModuleForm(true);
  };

  const openLessonForm = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    const nextLessonNumber = (module?.lessons?.length || 0) + 1;
    
    setEditingLesson(null);
    setLessonForm({
      module_id: moduleId,
      lesson_number: nextLessonNumber,
      title: '',
      description: '',
      video_url: '',
      duration_minutes: 0,
      order_position: nextLessonNumber,
      is_published: false,
      resource_url: '',
      resource_title: '',
    });
    setShowLessonForm(moduleId);
  };

  const startEditLesson = (lesson: any, moduleId: string) => {
    setEditingLesson({ id: lesson.id, moduleId });
    setLessonForm({
      module_id: moduleId,
      lesson_number: lesson.lesson_number,
      title: lesson.title,
      description: lesson.description || '',
      video_url: lesson.video_url || '',
      duration_minutes: lesson.duration_minutes || 0,
      order_position: lesson.order_position,
      is_published: lesson.is_published,
      resource_url: lesson.resource_url || '',
      resource_title: lesson.resource_title || '',
    });
    setShowLessonForm(moduleId);
  };

  // Open add module form with next available module number
  const openAddModuleForm = () => {
    setEditingModule(null);
    const nextModuleNumber = getNextAvailableModuleNumber();
    setModuleForm({
      module_number: nextModuleNumber,
      title: '',
      description: '',
      order_position: nextModuleNumber,
      is_published: false,
    });
    setShowModuleForm(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            ← Back to Admin
          </Link>
        </div>
        <nav className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Course Manager</h2>
          <p className="text-sm text-gray-600 mb-4">Manage all 8 modules and their lessons</p>
          
          {/* Existing Modules Overview */}
          {modules.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Existing Modules</h3>
              <div className="space-y-2">
                {modules.map((module) => (
                  <div 
                    key={module.id} 
                    className="text-xs p-2 bg-purple-50 rounded cursor-pointer hover:bg-purple-100"
                    onClick={() => startEditModule(module)}
                  >
                    <div className="font-medium text-purple-700">Module {module.module_number}</div>
                    <div className="text-gray-600 truncate">{module.title}</div>
                    <div className="text-gray-500 mt-1">
                      {module.lessons?.length || 0} lessons
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Manager</h1>
              <p className="text-gray-600 mt-2">Manage modules, lessons, and course content</p>
              {modules.length > 0 && (
                <p className="text-sm text-purple-600 mt-1">
                  {modules.length} module{modules.length !== 1 ? 's' : ''} created · {8 - modules.length} remaining
                </p>
              )}
            </div>
            <button
              onClick={openAddModuleForm}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              disabled={modules.length >= 8}
            >
              {modules.length >= 8 ? 'All Modules Created' : '+ Add Module'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">⚠️</span>
                <div className="flex-1">
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Module Form Modal */}
          {showModuleForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingModule ? 'Edit Module' : 'Add New Module'}
                  </h3>
                  {!editingModule && modules.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Creating module {moduleForm.module_number} of 8
                    </p>
                  )}
                </div>
                <form onSubmit={editingModule ? handleUpdateModule : handleCreateModule} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Number
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="8"
                      value={moduleForm.module_number}
                      onChange={(e) => setModuleForm({ ...moduleForm, module_number: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={!!editingModule}
                    />
                    {!editingModule && (
                      <p className="text-xs text-gray-500 mt-1">
                        Next available: {getNextAvailableModuleNumber()}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Module Title
                    </label>
                    <input
                      type="text"
                      required
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Introduction to Psychic Development"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe what students will learn in this module..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="module-published"
                      checked={moduleForm.is_published}
                      onChange={(e) => setModuleForm({ ...moduleForm, is_published: e.target.checked })}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="module-published" className="text-sm text-gray-700">
                      Publish module (make visible to members)
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                    >
                      {editingModule ? 'Update Module' : 'Create Module'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModuleForm(false);
                        setEditingModule(null);
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modules List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : modules.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
              <span className="text-6xl mb-4 block">📚</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules yet</h3>
              <p className="text-gray-600 mb-6">Create your first course module to get started</p>
              <button
                onClick={() => setShowModuleForm(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Add First Module
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Module Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                            Module {module.module_number}
                          </span>
                          {module.is_published ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                              ✓ Published
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                              📝 Draft
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                        {module.description && (
                          <p className="text-gray-600 text-sm">{module.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          {module.lessons?.length || 0} lessons · {module.published_lessons || 0} published
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditModule(module)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                          title="Edit module"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleToggleModulePublish(module.id, module.is_published)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title={module.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {module.is_published ? '👁️' : '📤'}
                        </button>
                        <button
                          onClick={() => handleDeleteModule(module.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete module"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lessons List */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Lessons</h4>
                      <button
                        onClick={() => openLessonForm(module.id)}
                        className="px-4 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium"
                      >
                        + Add Lesson
                      </button>
                    </div>

                    {/* Lesson Form */}
                    {showLessonForm === module.id && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h5 className="font-semibold text-gray-900 mb-3">
                          {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                        </h5>
                        <form onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson} className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lesson Number
                              </label>
                              <input
                                type="number"
                                required
                                min="1"
                                value={lessonForm.lesson_number}
                                onChange={(e) => setLessonForm({ ...lessonForm, lesson_number: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                disabled={!!editingLesson}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (minutes)
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={lessonForm.duration_minutes}
                                onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          {/* Resource Fields - Positioned after Duration, before YouTube URL */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Resource Title
                            </label>
                            <input
                              type="text"
                              value={lessonForm.resource_title || ''}
                              onChange={(e) => setLessonForm({ ...lessonForm, resource_title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="e.g., Module 1 Workbook"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              PDF/Resource URL
                            </label>
                            <input
                              type="url"
                              value={lessonForm.resource_url || ''}
                              onChange={(e) => setLessonForm({ ...lessonForm, resource_url: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Paste Google Drive or Dropbox link"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Lesson Title
                            </label>
                            <input
                              type="text"
                              required
                              value={lessonForm.title}
                              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="e.g., Welcome to Your Journey"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={lessonForm.description}
                              onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Brief description of the lesson..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              YouTube URL
                            </label>
                            <input
                              type="url"
                              required
                              value={lessonForm.video_url}
                              onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="https://www.youtube.com/watch?v=..."
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="lesson-published"
                              checked={lessonForm.is_published}
                              onChange={(e) => setLessonForm({ ...lessonForm, is_published: e.target.checked })}
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label htmlFor="lesson-published" className="text-sm text-gray-700">
                              Publish lesson
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                            >
                              {editingLesson ? 'Update Lesson' : 'Add Lesson'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowLessonForm(null);
                                setEditingLesson(null);
                              }}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {module.lessons && module.lessons.length > 0 ? (
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-purple-600">
                                  Lesson {lesson.lesson_number}
                                </span>
                                {lesson.is_published ? (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                    Published
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                    Draft
                                  </span>
                                )}
                              </div>
                              <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                              {lesson.description && (
                                <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                {lesson.duration_minutes && (
                                  <span>⏱️ {lesson.duration_minutes} min</span>
                                )}
                                <span>🎥 Video</span>
                                {lesson.resource_url && (
                                  <span>📄 PDF Resource</span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditLesson(lesson, module.id)}
                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                                title="Edit lesson"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleToggleLessonPublish(lesson.id, lesson.is_published)}
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                title={lesson.is_published ? 'Unpublish' : 'Publish'}
                              >
                                {lesson.is_published ? '👁️' : '📤'}
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                title="Delete lesson"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No lessons yet. Add your first lesson to this module.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}