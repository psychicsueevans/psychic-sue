'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { courseService } from '../../../services/courseService';

import { meditationService } from '../../../services/meditationService';
import { resourceService } from '../../../services/resourceService';

import { memberService } from '../../../services/memberService';
import { supabase, signInAnonymously } from '@/lib/supabase';

interface DashboardStats {
  totalModules: number;
  totalLessons: number;
  totalMembers: number;
  activeMembers: number;
  totalMeditations: number;
  totalResources: number;
}

type AdminSection = 'dashboard' | 'courses' | 'messages' | 'meditations' | 'resources' | 'readings' | 'products' | 'members';

export function AdminInteractive() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalModules: 0,
    totalLessons: 0,
    totalMembers: 0,
    activeMembers: 0,
    totalMeditations: 0,
    totalResources: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthAndInitialize();
  }, []);

  // Add effect to load stats when authenticated
  useEffect(() => {
    if (isAuthenticated && activeSection === 'dashboard') {
      loadDashboardStats();
    }
  }, [isAuthenticated, activeSection]);

  const checkAuthAndInitialize = async () => {
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // If no session, sign in anonymously for admin access
      const { data, error } = await signInAnonymously();
      
      if (error) {
        console.error('Authentication error:', error);
        setError('Failed to authenticate. Please check your Supabase configuration.');
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        setIsAuthenticated(true);
      } else {
        setError('Unable to establish session. Please verify anonymous auth is enabled in Supabase.');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize admin:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize admin panel');
      setIsLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const [modulesRes, lessonsRes, membersRes, meditationsRes, resourcesRes] = await Promise.all([
        courseService.getAllModules(),
        courseService.getModulesWithLessons(),
        memberService.getAllMembers(),
        meditationService.getAllMeditations(),
        resourceService.getAllResources(),
      ]);

      if (modulesRes.error) throw modulesRes.error;
      if (lessonsRes.error) throw lessonsRes.error;
      if (membersRes.error) throw membersRes.error;
      if (meditationsRes.error) throw meditationsRes.error;
      if (resourcesRes.error) throw resourcesRes.error;

      const totalLessons = (lessonsRes.data || []).reduce(
        (acc, module) => acc + (module.lessons?.length || 0),
        0
      );

      setStats({
        totalModules: modulesRes.data?.length || 0,
        totalLessons,
        totalMembers: membersRes.data?.length || 0,
        activeMembers: membersRes.data?.filter(m => m.is_active).length || 0,
        totalMeditations: meditationsRes.data?.length || 0,
        totalResources: resourcesRes.data?.length || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const navigationItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: '📊', href: '/admin' },
    { id: 'courses' as AdminSection, label: 'Course Manager', icon: '📚', href: '/admin/courses' },
    { id: 'messages' as AdminSection, label: 'Weekly Messages', icon: '💌', href: '/admin/messages' },
    { id: 'meditations' as AdminSection, label: 'Meditations', icon: '🧘', href: '/admin/meditations' },
    { id: 'resources' as AdminSection, label: 'Resources', icon: '📁', href: '/admin/resources' },
    { id: 'readings' as AdminSection, label: 'Digital Readings', icon: '🔮', href: '/admin/readings' },
    { id: 'products' as AdminSection, label: 'Reading Products', icon: '🛒', href: '/admin/products' },
    { id: 'members' as AdminSection, label: 'Members', icon: '👥', href: '/admin/members' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Initializing Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Unable to authenticate. Please check your Supabase configuration.</p>
          <button
            onClick={checkAuthAndInitialize}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-purple-600">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Content Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-purple-50 text-purple-700 font-medium' :'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="px-4 py-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700 font-medium">Logged in as</p>
            <p className="text-xs text-purple-600 mt-1">Sue (Admin)</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {activeSection === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-600 mt-2">Welcome back! Here's your content summary.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Course Modules</h3>
                      <span className="text-2xl">📚</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalModules}</p>
                    <p className="text-sm text-gray-500 mt-1">{stats.totalLessons} total lessons</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Active Members</h3>
                      <span className="text-2xl">👥</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeMembers}</p>
                    <p className="text-sm text-gray-500 mt-1">{stats.totalMembers} total members</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Meditations</h3>
                      <span className="text-2xl">🧘</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalMeditations}</p>
                    <p className="text-sm text-gray-500 mt-1">Available meditations</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Resources</h3>
                      <span className="text-2xl">📁</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalResources}</p>
                    <p className="text-sm text-gray-500 mt-1">Downloadable resources</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {navigationItems.slice(1).map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                        onClick={() => setActiveSection(item.id)}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">Manage content</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeSection !== 'dashboard' && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {navigationItems.find(item => item.id === activeSection)?.label}
            </h2>
            <p className="text-gray-600">
              Navigate to the specific management page using the sidebar.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}