'use client';

import React, { useState, useEffect } from 'react';
import { courseService } from '@/services/courseService';
import type { CourseModule, CourseLesson } from '@/types/course.types';

export default function CourseManager() {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);

  // Module form state
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    module_number: 1,
    order_position: 1,
    is_published: false
  });

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0,
    lesson_number: 1,
    order_position: 1,
    module_id: '',
    is_published: false
  });

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      loadLessons(selectedModule.id);
    }
  }, [selectedModule]);

  const loadModules = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await courseService.getAllModules();
    if (err) {
      setError('Failed to load modules: ' + err.message);
    } else {
      setModules(data || []);
      setSuccess('Modules loaded successfully');
      setTimeout(() => setSuccess(null), 3000);
    }
    setLoading(false);
  };

  const loadLessons = async (moduleId: string) => {
    const { data, error: err } = await courseService.getLessonsByModuleId(moduleId);
    if (err) {
      setError(err.message);
    } else {
      setLessons(data || []);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const moduleData = {
      title: moduleForm.title,
      description: moduleForm.description,
      module_number: moduleForm.module_number,
      order_position: moduleForm.order_position,
      is_published: moduleForm.is_published
    };

    const { error: err } = await courseService.createModule(moduleData);
    if (err) {
      setError('Failed to create module: ' + err.message);
    } else {
      setSuccess('Module created successfully!');
      setShowModuleForm(false);
      setModuleForm({ title: '', description: '', module_number: 1, order_position: 1, is_published: false });
      loadModules();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;
    
    setError(null);
    setSuccess(null);
    
    const moduleData = {
      title: moduleForm.title,
      description: moduleForm.description,
      module_number: moduleForm.module_number,
      order_position: moduleForm.order_position,
      is_published: moduleForm.is_published
    };

    const { error: err } = await courseService.updateModule(editingModule.id, moduleData);
    if (err) {
      setError('Failed to update module: ' + err.message);
    } else {
      setSuccess('Module updated successfully!');
      setEditingModule(null);
      setShowModuleForm(false);
      setModuleForm({ title: '', description: '', module_number: 1, order_position: 1, is_published: false });
      loadModules();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all lessons in this module.')) return;
    const { error: err } = await courseService.deleteModule(id);
    if (err) {
      setError(err.message);
    } else {
      loadModules();
      if (selectedModule?.id === id) {
        setSelectedModule(null);
        setLessons([]);
      }
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!selectedModule) {
      setError('Please select a module first');
      return;
    }
    
    const lessonData = {
      title: lessonForm.title,
      description: lessonForm.description,
      video_url: lessonForm.video_url,
      duration_minutes: lessonForm.duration_minutes,
      lesson_number: lessonForm.lesson_number,
      order_position: lessonForm.order_position,
      module_id: selectedModule.id,
      is_published: lessonForm.is_published
    };

    const { error: err } = await courseService.createLesson(lessonData);
    if (err) {
      setError('Failed to create lesson: ' + err.message);
    } else {
      setSuccess('Lesson created successfully!');
      setShowLessonForm(false);
      setLessonForm({
        title: '',
        description: '',
        video_url: '',
        duration_minutes: 0,
        lesson_number: 1,
        order_position: 1,
        module_id: '',
        is_published: false
      });
      loadLessons(selectedModule.id);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !selectedModule) return;
    
    setError(null);
    setSuccess(null);
    
    const lessonData = {
      title: lessonForm.title,
      description: lessonForm.description,
      video_url: lessonForm.video_url,
      duration_minutes: lessonForm.duration_minutes,
      lesson_number: lessonForm.lesson_number,
      order_position: lessonForm.order_position,
      module_id: selectedModule.id,
      is_published: lessonForm.is_published
    };

    const { error: err } = await courseService.updateLesson(editingLesson.id, lessonData);
    if (err) {
      setError('Failed to update lesson: ' + err.message);
    } else {
      setSuccess('Lesson updated successfully!');
      setEditingLesson(null);
      setShowLessonForm(false);
      setLessonForm({
        title: '',
        description: '',
        video_url: '',
        duration_minutes: 0,
        lesson_number: 1,
        order_position: 1,
        module_id: '',
        is_published: false
      });
      loadLessons(selectedModule.id);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    const { error: err } = await courseService.deleteLesson(id);
    if (err) {
      setError(err.message);
    } else {
      if (selectedModule) {
        loadLessons(selectedModule.id);
      }
    }
  };

  const handleToggleModulePublish = async (module: CourseModule) => {
    const { error: err } = module.is_published
      ? await courseService.unpublishModule(module.id)
      : await courseService.publishModule(module.id);
    if (err) {
      setError(err.message);
    } else {
      loadModules();
    }
  };

  const handleToggleLessonPublish = async (lesson: CourseLesson) => {
    const { error: err } = lesson.is_published
      ? await courseService.unpublishLesson(lesson.id)
      : await courseService.publishLesson(lesson.id);
    if (err) {
      setError(err.message);
    } else {
      if (selectedModule) {
        loadLessons(selectedModule.id);
      }
    }
  };

  const startEditModule = (module: CourseModule) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description || '',
      module_number: module.module_number,
      order_position: module.order_position,
      is_published: module.is_published
    });
    setShowModuleForm(true);
  };

  const startEditLesson = (lesson: CourseLesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      video_url: lesson.video_url,
      duration_minutes: lesson.duration_minutes || 0,
      lesson_number: lesson.lesson_number,
      order_position: lesson.order_position,
      module_id: lesson.module_id,
      is_published: lesson.is_published
    });
    setShowLessonForm(true);
  };

  const startAddLesson = () => {
    if (!selectedModule) return;
    setEditingLesson(null);
    setLessonForm({
      title: '',
      description: '',
      video_url: '',
      duration_minutes: 0,
      lesson_number: (lessons?.length || 0) + 1,
      order_position: (lessons?.length || 0) + 1,
      module_id: selectedModule.id,
      is_published: false
    });
    setShowLessonForm(true);
  };

  if (loading) {
    return <div className="text-center py-12">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-900 font-semibold mb-2">📚 Quick Guide</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Add Module" to create a new course module (1-8)</li>
          <li>• Select a module to view and manage its lessons</li>
          <li>• Click "Add Lesson" to add lessons to the selected module</li>
          <li>• Use the edit ✏️ and delete 🗑️ buttons to manage content</li>
        </ul>
      </div>

      {/* Modules Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Course Modules (1-8)</h2>
          <button
            onClick={() => {
              setEditingModule(null);
              setModuleForm({ title: '', description: '', module_number: (modules?.length || 0) + 1, order_position: (modules?.length || 0) + 1, is_published: false });
              setShowModuleForm(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add Module
          </button>
        </div>

        {/* Module Form */}
        {showModuleForm && (
          <form onSubmit={editingModule ? handleUpdateModule : handleCreateModule} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">{editingModule ? 'Edit Module' : 'New Module'}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module Number (1-8)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={moduleForm.module_number}
                onChange={(e) => setModuleForm({ ...moduleForm, module_number: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={moduleForm.is_published}
                onChange={(e) => setModuleForm({ ...moduleForm, is_published: e.target.checked })}
                className="rounded"
              />
              <label className="text-sm text-gray-700">Published</label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                {editingModule ? 'Update' : 'Create'} Module
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModuleForm(false);
                  setEditingModule(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Modules List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules?.map((module) => (
            <div
              key={module.id}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                selectedModule?.id === module.id
                  ? 'border-purple-500 bg-purple-50' :'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedModule(module)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-500">Module {module.module_number}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      module.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {module.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditModule(module);
                    }}
                    className="text-purple-600 hover:text-purple-800 text-lg"
                    title="Edit Module"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteModule(module.id);
                    }}
                    className="text-red-600 hover:text-red-800 text-lg"
                    title="Delete Module"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons Section */}
      {selectedModule && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Lessons for Module {selectedModule.module_number}: {selectedModule.title}
            </h2>
            <button
              onClick={startAddLesson}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Lesson
            </button>
          </div>

          {/* Lesson Form */}
          {showLessonForm && (
            <form onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold">{editingLesson ? 'Edit Lesson' : 'New Lesson'}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={lessonForm.video_url}
                  onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Paste your YouTube video URL here</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={lessonForm.duration_minutes}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lessonForm.is_published}
                  onChange={(e) => setLessonForm({ ...lessonForm, is_published: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm text-gray-700">Published</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  {editingLesson ? 'Update' : 'Create'} Lesson
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLessonForm(false);
                    setEditingLesson(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Lessons List */}
          <div className="space-y-3">
            {lessons?.map((lesson) => (
              <div key={lesson.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-500">Lesson {lesson.lesson_number}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        lesson.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lesson.is_published ? 'Published' : 'Draft'}
                      </span>
                      {lesson.duration_minutes && (
                        <span className="text-xs text-gray-500">{lesson.duration_minutes} min</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                    <p className="text-xs text-purple-600 mt-2">{lesson.video_url}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditLesson(lesson)}
                      className="text-purple-600 hover:text-purple-800 text-lg"
                      title="Edit Lesson"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="text-red-600 hover:text-red-800 text-lg"
                      title="Delete Lesson"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {lessons?.length === 0 && (
              <p className="text-center text-gray-500 py-8">No lessons yet. Click "Add Lesson" to create one.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}