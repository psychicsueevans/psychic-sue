'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, signInAnonymously } from '@/lib/supabase';
import ReadingProductsManager from '../components/ReadingProductsManager';

type AdminSection = 'dashboard' | 'courses' | 'messages' | 'meditations' | 'resources' | 'readings' | 'products' | 'members';

export default function AdminProductsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const activeSection: AdminSection = 'products';

  useEffect(() => {
    checkAuthAndInitialize();
  }, []);

  const checkAuthAndInitialize = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const { data, error } = await signInAnonymously();
      
      if (error) {
        console.error('Authentication error:', error);
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize admin:', error);
      setIsLoading(false);
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
          <p className="text-purple-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Unable to authenticate.</p>
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
                  ? 'bg-purple-50 text-purple-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
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
        <ReadingProductsManager />
      </main>
    </div>
  );
}
