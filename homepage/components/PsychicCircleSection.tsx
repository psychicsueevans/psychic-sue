'use client';

import { useState } from 'react';
import VIPWaitlistPopup from '@/components/common/VIPWaitlistPopup';

interface PsychicCircleSectionProps {
  onJoinCircle: () => void;
}

export default function PsychicCircleSection({ onJoinCircle }: PsychicCircleSectionProps) {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const stats = [
    { value: '30', label: 'Exclusive Spots' },
    { value: '50+', label: 'Years Experience' },
    { value: '60min', label: 'Monthly Readings' },
    { value: 'VIP', label: 'Priority Always' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-16 lg:py-24 overflow-hidden">
      {/* Mystical background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto px-6 max-w-7xl">
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <span className="text-sm font-semibold text-white tracking-wide">
              Only 30 Exclusive Spots
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-bold text-center text-white mb-6">
          The Psychic Circle
        </h2>

        {/* Subtext */}
        <p className="text-lg lg:text-xl text-center text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
          Join my inner circle for exclusive monthly guidance, direct access to
          me, and complete psychic development training. This is the VIP
          experience.
        </p>

        {/* Membership Tier Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-16">
          {/* CARD 1 - THE CIRCLE */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-3xl font-bold text-purple-900 mb-4">
              THE CIRCLE
            </h3>
            <div className="mb-6">
              <div className="text-4xl font-bold text-purple-900">
                $35<span className="text-xl font-normal text-gray-600">/month</span>
              </div>
            </div>
            <div className="space-y-3 mb-8">
              <p className="text-gray-700 font-semibold mb-4">What's included:</p>
              <div className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <p className="text-gray-700">8-Module Professional Course (worth $1,200)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <p className="text-gray-700">40+ Video Lessons - Lifetime access</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <p className="text-gray-700">Weekly Tarot Messages</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <p className="text-gray-700">Guided Meditation Library - 24/7 access</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <p className="text-gray-700">Same Day Digital Readings</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <p className="text-gray-700">Exclusive Tools (tarot journal, manifestation workbook)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">•</span>
                <p className="text-gray-700">Member Community Access</p>
              </div>
            </div>
            <a
              href="/the-psychic-circle-sales"
              className="block w-full text-center px-6 py-4 bg-purple-900 text-white font-bold text-lg rounded-full hover:bg-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Join The Circle
            </a>
          </div>

          {/* CARD 2 - VIP CIRCLE */}
          <div className="relative bg-gradient-to-br from-white via-amber-50 to-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-amber-300">
            {/* VIP FULL Badge */}
            <div className="absolute top-6 right-6">
              <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                VIP FULL
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-purple-900 mb-4">
              VIP CIRCLE
            </h3>
            <div className="mb-2">
              <div className="text-4xl font-bold text-purple-900">
                $547<span className="text-xl font-normal text-gray-600"> for 6 months</span>
              </div>
            </div>
            <p className="text-gray-600 italic mb-6">That's just $91 per month</p>
            
            <div className="space-y-3 mb-8">
              <p className="text-gray-700 font-semibold mb-4">Everything in The Circle, PLUS:</p>
              <div className="flex items-start gap-3">
                <span className="text-amber-600 mt-1">•</span>
                <p className="text-gray-700 font-medium">60-Minute Phone Reading every month (worth $100)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-600 mt-1">•</span>
                <p className="text-gray-700 font-medium">Voice Note Support between calls</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-600 mt-1">•</span>
                <p className="text-gray-700 font-medium">Direct WhatsApp Access to Sue</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-600 mt-1">•</span>
                <p className="text-gray-700 font-medium">Priority Booking Always</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-600 mt-1">•</span>
                <p className="text-gray-700 font-medium">20% Discount on additional readings</p>
              </div>
            </div>
            <button
              onClick={() => setIsWaitlistOpen(true)}
              className="block w-full text-center px-6 py-4 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold text-lg rounded-full hover:from-amber-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Join Waitlist
            </button>
          </div>
        </div>

        {/* Course Modules Breakdown */}
        <div className="max-w-6xl mx-auto mt-20">
          {/* Heading */}
          <h3 className="text-3xl lg:text-4xl font-bold text-center text-white mb-4">
            Complete 8-Module Psychic Development Course
          </h3>
          
          {/* Subtext */}
          <p className="text-lg lg:text-xl text-center text-white/90 mb-12 italic">
            The ONLY course that teaches you how to turn your gift into a career
          </p>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Module 1 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-purple-300 font-semibold text-sm mb-2">Module 1</div>
              <div className="text-white font-bold text-lg">Developing Your Abilities</div>
            </div>

            {/* Module 2 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-purple-300 font-semibold text-sm mb-2">Module 2</div>
              <div className="text-white font-bold text-lg">Protection & Energy</div>
            </div>

            {/* Module 3 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-purple-300 font-semibold text-sm mb-2">Module 3</div>
              <div className="text-white font-bold text-lg">Working with Spirit</div>
            </div>

            {/* Module 4 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-purple-300 font-semibold text-sm mb-2">Module 4</div>
              <div className="text-white font-bold text-lg">Knowing What's Real</div>
            </div>

            {/* Module 5 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-purple-300 font-semibold text-sm mb-2">Module 5</div>
              <div className="text-white font-bold text-lg">Tarot & Divination</div>
            </div>

            {/* Module 6 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-purple-300 font-semibold text-sm mb-2">Module 6</div>
              <div className="text-white font-bold text-lg">Healing & Manifestation</div>
            </div>

            {/* Module 7 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-purple-300 font-semibold text-sm mb-2">Module 7</div>
              <div className="text-white font-bold text-lg">Working with Others</div>
            </div>

            {/* Module 8 - Star Module */}
            <div className="bg-gradient-to-br from-amber-500/20 to-purple-500/20 backdrop-blur-md border-2 border-amber-400/50 rounded-2xl p-6 hover:from-amber-500/30 hover:to-purple-500/30 transition-all duration-300 shadow-lg">
              <div className="text-amber-300 font-semibold text-sm mb-2">Module 8</div>
              <div className="text-white font-bold text-lg flex items-center gap-2">
                From Gift to Career
                <span className="text-amber-300 text-xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={onJoinCircle}
            className="px-8 py-4 bg-white text-purple-900 font-bold text-lg rounded-full hover:bg-purple-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Join The Circle
          </button>
        </div>
      </div>

      <VIPWaitlistPopup isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </section>
  );
}