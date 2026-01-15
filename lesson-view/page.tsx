'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { courseService } from '@/services/courseService';
import type { Lesson } from '@/types/course.types';

// Helper function to convert video URLs to embed format
function convertToEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Handle YouTube URLs
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    
    // Extract video ID from different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/embed/')) {
      return url; // Already in embed format
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Handle Vimeo URLs
  if (url.includes('vimeo.com')) {
    let videoId = url.split('vimeo.com/')[1]?.split('?')[0] || '';
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}`;
    }
  }
  
  // For other URLs, return as-is
  return url;
}

function LessonViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleNumber = searchParams?.get('module');
  const lessonNumber = searchParams?.get('lesson');
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!moduleNumber || !lessonNumber) {
      setError('Missing module or lesson information');
      setIsLoading(false);
      return;
    }

    loadLessonData();
  }, [moduleNumber, lessonNumber]);

  const loadLessonData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get all modules to find the correct module
      const { data: modules, error: modulesError } = await courseService.getModulesWithLessons();
      
      if (modulesError) {
        setError('Failed to load lesson data');
        setIsLoading(false);
        return;
      }

      const module = modules?.find(m => m.module_number === parseInt(moduleNumber!));
      
      if (!module) {
        setError('Module not found');
        setIsLoading(false);
        return;
      }

      // Get lessons for this module
      const { data: lessons, error: lessonsError } = await courseService.getLessonsByModule(module.id);
      
      if (lessonsError) {
        setError('Failed to load lesson');
        setIsLoading(false);
        return;
      }

      const foundLesson = lessons?.find(l => l.lesson_number === parseInt(lessonNumber!));
      
      if (!foundLesson) {
        setError('Lesson not found');
        setIsLoading(false);
        return;
      }

      setLesson(foundLesson);
      
      // TODO: Check lesson completion status from lesson_progress table
      setIsCompleted(false);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkComplete = () => {
    // TODO: Update lesson_progress table
    setIsCompleted(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFE] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-[#FDFCFE] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error || 'Lesson not found'}</div>
          <Link
            href={`/module-view?module=${moduleNumber}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Module
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFE]">
      <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
        {/* Back Button */}
        <Link
          href={`/module-view?module=${moduleNumber}`}
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Module
        </Link>

        {/* Lesson Header */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-purple-100 mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-3">
                Lesson {lesson.lesson_number}
              </div>
              <h1 className="text-3xl font-bold text-purple-950 mb-2">{lesson.title}</h1>
              <p className="text-purple-600">{lesson.description}</p>
            </div>
            {isCompleted && (
              <div className="flex-shrink-0">
                <CheckCircleIcon className="w-12 h-12 text-green-500" />
              </div>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-purple-100 mb-8">
          {/* Video Section - Show first if video exists */}
          {lesson.video_url && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-950 mb-4">Lesson Video</h2>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={convertToEmbedUrl(lesson.video_url)}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={`Video for ${lesson.title}`}
                />
              </div>
            </div>
          )}

          {/* PDF Resource Download Button */}
          {lesson.resource_url && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-950 mb-4">Lesson Resources</h2>
              <a
                href={lesson.resource_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <div className="text-left">
                  <div className="font-semibold">
                    {lesson.resource_title || 'Download Lesson Resource'}
                  </div>
                  <div className="text-sm text-purple-100">
                    PDF Document
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* Lesson Content Text */}
          <div className="prose prose-purple max-w-none">
            {lesson.content && lesson.content.trim() ? (
              <div 
                className="text-purple-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lesson.content }} 
              />
            ) : lesson.description && lesson.description.trim() ? (
              <div className="text-purple-800 leading-relaxed">
                <p className="text-lg whitespace-pre-wrap">{lesson.description}</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-purple-600 text-lg">Lesson content will be available soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            href={`/module-view?module=${moduleNumber}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Module
          </Link>

          <div className="flex gap-4">
            {!isCompleted && (
              <button
                onClick={handleMarkComplete}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Mark as Complete
              </button>
            )}
            
            <Link
              href={`/lesson-view?module=${moduleNumber}&lesson=${parseInt(lessonNumber!) + 1}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Next Lesson
              <ArrowLeftIcon className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LessonView() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFCFE] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading...</p>
        </div>
      </div>
    }>
      <LessonViewContent />
    </Suspense>
  );
}