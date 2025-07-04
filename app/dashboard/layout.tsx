'use client';

import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Sidebar from '../../components/Sidebar-modern';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="lg:pl-80 flex flex-col flex-1">
          {/* Header mobile */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b">
              <h1 className="text-lg font-semibold text-gray-900">
                {user?.role === 'admin' ? 'Administration' : 'Mon Espace'}
              </h1>
            </div>
          </div>
          
          {/* Page content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
