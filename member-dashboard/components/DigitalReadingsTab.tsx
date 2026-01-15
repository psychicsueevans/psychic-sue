'use client';

import { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import { SparklesIcon, LightBulbIcon, BookOpenIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { digitalReadingService } from '@/services/digitalReadingService';
import type { DigitalReading } from '@/types/admin.types';

type Category = 'love_relationships' | 'general' | null;
type ViewState = 'initial' | 'number-selection' | 'video-result' | 'coming-soon';

const DigitalReadingsTab = () => {
  const [viewState, setViewState] = useState<ViewState>('initial');
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<DigitalReading | null>(null);
  const [readings, setReadings] = useState<DigitalReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await digitalReadingService.getAllReadings();
      
      if (fetchError) {
        setError('Failed to load digital readings. Please try again later.');
        return;
      }
      
      if (data) {
        setReadings(data);
      }
    } catch (err) {
      setError('Failed to load digital readings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'love_relationships' as Category, name: 'Love & Relationships', color: 'bg-pink-100', iconColor: 'text-pink-600' },
    { id: 'general' as Category, name: 'General Guidance', color: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setViewState('number-selection');
  };

  const handleNumberSelect = (number: number) => {
    setSelectedNumber(number);
    setError(null);
    const card = readings.find(r => r.card_number === number && r.category === selectedCategory);
    if (card) {
      setSelectedCard(card);
      setViewState('video-result');
    } else {
      setViewState('coming-soon');
    }
  };

  const handleChooseAgain = () => {
    setViewState('initial');
    setSelectedCategory(null);
    setSelectedNumber(null);
    setSelectedCard(null);
    setError(null);
  };

  const handleChangeCategory = () => {
    setViewState('initial');
    setSelectedCategory(null);
    setError(null);
  };

  const getCategoryName = () => {
    return categories.find(c => c.id === selectedCategory)?.name || '';
  };

  const extractYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url;
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && viewState === 'initial' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-purple-600 mt-4">Loading digital readings...</p>
        </div>
      )}

      {/* INITIAL STATE */}
      {!isLoading && viewState === 'initial' && (
        <>
          {/* Header Section */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-purple-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-purple-950 mb-2">Instant Tarot Guidance</h1>
                <p className="text-purple-600">Get immediate guidance from Sue's pre-recorded card readings</p>
              </div>
            </div>

            {/* How It Works Box */}
            <div className="bg-gray-50 rounded-lg p-6 mt-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                  <LightBulbIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-purple-950">How It Works</h2>
              </div>
              <ol className="space-y-3 text-purple-900">
                <li className="flex gap-3">
                  <span className="font-bold text-purple-700 flex-shrink-0">1.</span>
                  <span>Take a moment to focus on your question or situation</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-purple-700 flex-shrink-0">2.</span>
                  <span>Select the category that best fits your question</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-purple-700 flex-shrink-0">3.</span>
                  <span>When you feel ready, choose a number from 0-21</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-purple-700 flex-shrink-0">4.</span>
                  <span>Watch Sue's personalized video message for your chosen card</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">{error}</p>
              <button
                onClick={loadReadings}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Category Selection */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-purple-100">
            <h2 className="text-xl font-bold text-purple-950 mb-6">What area do you need guidance on?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((category) => {
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-600 hover:shadow-md transition-all text-left group"
                  >
                    <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {category.id === 'love_relationships' && <Heart className={`w-6 h-6 ${category.iconColor}`} />}
                      {category.id === 'general' && <Star className={`w-6 h-6 ${category.iconColor}`} />}
                    </div>
                    <h3 className="font-bold text-purple-950 text-sm sm:text-base">{category.name}</h3>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* STATE 2: NUMBER SELECTION */}
      {viewState === 'number-selection' && selectedCategory && (
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-purple-100">
          {/* Selected Category Display */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-purple-100 rounded-lg mb-4">
              {(() => {
                const category = categories.find(c => c.id === selectedCategory);
                return (
                  <>
                    {selectedCategory === 'love_relationships' && <Heart className="w-5 h-5 text-purple-700" />}
                    {selectedCategory === 'general' && <Star className="w-5 h-5 text-purple-700" />}
                    <span className="font-medium text-purple-900">{category?.name}</span>
                  </>
                );
              })()}
            </div>
            <button
              onClick={handleChangeCategory}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
            >
              <span>←</span> Change Category
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Number Selection */}
          <h2 className="text-2xl font-bold text-purple-950 mb-2">Choose Your Card Number (0-21)</h2>
          <p className="text-purple-600 mb-6">Trust your intuition and pick the number that calls to you</p>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-3">
            {Array.from({ length: 22 }, (_, i) => i).map((number) => (
              <button
                key={number}
                onClick={() => handleNumberSelect(number)}
                className="aspect-square bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold text-lg rounded-lg hover:from-purple-600 hover:to-purple-800 hover:scale-105 transition-all shadow-md hover:shadow-lg"
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STATE 3: VIDEO RESULT */}
      {viewState === 'video-result' && selectedCard && selectedCategory && (
        <div className="space-y-6">
          {/* Header with Choose Again Button */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-purple-950 mb-1">
                  {getCategoryName()} — Card {selectedCard.card_number}
                </h1>
                <p className="text-purple-600">{selectedCard.card_name} — Sue's guidance for you</p>
              </div>
              <button
                onClick={handleChooseAgain}
                className="px-4 py-2 border-2 border-purple-600 text-purple-700 font-medium rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap"
              >
                Choose Again
              </button>
            </div>

            {/* Video Player */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(selectedCard.video_url)}`}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Description */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-purple-900">
                Watch Sue's personalized guidance for <strong>{selectedCard.card_name}</strong> in the <strong>{getCategoryName()}</strong> category. This message was created to help you find clarity and direction in your current situation.
              </p>
            </div>
          </div>

          {/* Quick Card Meaning */}
          {selectedCard.card_meaning && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-purple-950">Quick Card Meaning</h2>
              </div>
              <p className="text-purple-900 leading-relaxed">{selectedCard.card_meaning}</p>
            </div>
          )}

          {/* Upsell Section */}
          <div className="bg-purple-50 rounded-xl p-6 sm:p-8 shadow-sm border border-purple-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                <QuestionMarkCircleIcon className="w-7 h-7 text-purple-700" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-purple-950 mb-2">Need a Personal Reading?</h2>
                <p className="text-purple-900 mb-4">
                  For deeper guidance tailored specifically to your situation, book a personal reading with Sue.
                </p>
                <Link
                  href="/services-booking"
                  className="inline-block bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Book Personal Reading
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 4: COMING SOON */}
      {viewState === 'coming-soon' && selectedCategory && selectedNumber !== null && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-purple-100 text-center">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="w-10 h-10 text-purple-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-purple-950 mb-3">This reading is coming soon!</h2>
            <p className="text-purple-700 text-lg mb-6">
              Card {selectedNumber} for {getCategoryName()} is being prepared by Sue. Check back later to access this guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleChooseAgain}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Choose Another Card
              </button>
              <Link
                href="/services-booking"
                className="px-6 py-3 border-2 border-purple-600 text-purple-700 font-medium rounded-lg hover:bg-purple-50 transition-colors"
              >
                Book Personal Reading
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalReadingsTab;