'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xl font-bold text-white">Enterprise Support Console</div>
            <div className="ml-8 flex space-x-4">
              <Link 
                href="/admin"
                className={`px-3 py-2 text-sm transition-colors ${
                  pathname === '/admin' 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/analytics"
                className={`px-3 py-2 text-sm transition-colors ${
                  pathname === '/admin/analytics' 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Analytics
              </Link>
              <Link 
                href="/admin/reports"
                className={`px-3 py-2 text-sm transition-colors ${
                  pathname === '/admin/reports' 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Reports
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">Admin Console</span>
            <button className="text-sm text-gray-400 hover:text-white">Sign Out</button>
          </div>
        </div>
      </nav>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
} 