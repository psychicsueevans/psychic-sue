'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

// Helper function to convert YouTube/Vimeo URLs to embed URLs
function getEmbedUrl(url: string): string {
  // YouTube URL patterns
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo URL pattern
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // If already an embed URL or unknown format, return as-is
  return url;
}

interface LessonData {
  moduleNumber: number;
  moduleTitle: string;
  lessonNumber: number;
  totalLessons: number;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  isCompleted: boolean;
}

export default function LessonViewInteractive() {
  const searchParams = useSearchParams();
  const moduleParam = searchParams.get('module');
  const lessonParam = searchParams.get('lesson');

  // Mock data - Lesson 4 from Module 3 example
  const [lessonData] = useState<LessonData>({
    moduleNumber: parseInt(moduleParam || '3'),
    moduleTitle: 'Working with Spirit',
    lessonNumber: parseInt(lessonParam || '4'),
    totalLessons: 7,
    title: 'Recognizing Signs',
    duration: '15 minutes',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder - replace with actual video
    description:
      'In this lesson, you\'ll learn how to recognize and interpret signs from the spirit world. We\'ll explore common signs, how to distinguish them from coincidence, and techniques to strengthen your connection with spirit guides.',
    isCompleted: false,
  });

  const [completed, setCompleted] = useState(lessonData.isCompleted);

  const handleMarkComplete = () => {
    setCompleted(!completed);
  };

  const hasPrevious = lessonData.lessonNumber > 1;
  const hasNext = lessonData.lessonNumber < lessonData.totalLessons;
  const embedUrl = getEmbedUrl(lessonData.videoUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/module-view?module=${lessonData.moduleNumber}`}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-colors"
          >
            <Icon name="ArrowLeftIcon" size={20} />
            <span>Back to Module {lessonData.moduleNumber}</span>
          </Link>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-950">{lessonData.title}</h1>
            <span className="text-sm text-purple-600 font-medium">
              Lesson {lessonData.lessonNumber} of {lessonData.totalLessons}
            </span>
          </div>
          <p className="text-purple-600">{lessonData.duration}</p>
        </div>

        {/* Video Player */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden mb-6">
          <div className="relative aspect-video bg-black">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              title={lessonData.title}
            />
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-purple-100 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-purple-950">Lesson Overview</h2>
            <button
              onClick={handleMarkComplete}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                completed
                  ? 'bg-green-500 text-white hover:bg-green-600' :'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {completed ? (
                <span className="flex items-center gap-2">
                  <Icon name="CheckIcon" size={20} />
                  Completed
                </span>
              ) : (
                'Mark as Complete'
              )}
            </button>
          </div>

          <div className="prose prose-purple max-w-none">
            <p className="text-purple-900 leading-relaxed">{lessonData.description}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4">
          {hasPrevious ? (
            <Link
              href={`/lesson-view?module=${lessonData.moduleNumber}&lesson=${lessonData.lessonNumber - 1}`}
              className="flex-1 bg-white text-purple-600 font-medium py-3 px-6 rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="ChevronLeftIcon" size={20} />
              <span>Previous Lesson</span>
            </Link>
          ) : (
            <div className="flex-1 bg-gray-100 text-gray-400 font-medium py-3 px-6 rounded-lg border-2 border-gray-200 cursor-not-allowed flex items-center justify-center gap-2">
              <Icon name="ChevronLeftIcon" size={20} />
              <span>Previous Lesson</span>
            </div>
          )}

          {hasNext ? (
            <Link
              href={`/lesson-view?module=${lessonData.moduleNumber}&lesson=${lessonData.lessonNumber + 1}`}
              className="flex-1 bg-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Next Lesson</span>
              <Icon name="ChevronRightIcon" size={20} />
            </Link>
          ) : (
            <div className="flex-1 bg-gray-100 text-gray-400 font-medium py-3 px-6 rounded-lg border-2 border-gray-200 cursor-not-allowed flex items-center justify-center gap-2">
              <span>Next Lesson</span>
              <Icon name="ChevronRightIcon" size={20} />
            </div>
          )}
        </div>

        {/* Optional: Module Progress Sidebar */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-purple-100">
          <h3 className="text-lg font-bold text-purple-950 mb-4">Module Progress</h3>
          <div className="space-y-2">
            {Array.from({ length: lessonData.totalLessons }, (_, i) => i + 1).map((num) => (
              <Link
                key={num}
                href={`/lesson-view?module=${lessonData.moduleNumber}&lesson=${num}`}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  num === lessonData.lessonNumber
                    ? 'bg-purple-100 text-purple-700 font-medium' :'text-purple-600 hover:bg-purple-50'
                }`}
              >
                Lesson {num}
                {num === lessonData.lessonNumber && ' (Current)'}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}