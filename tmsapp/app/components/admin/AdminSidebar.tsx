'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Tickets', path: '/admin/tickets' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'Settings', path: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="text-xl font-bold mb-8 p-2">Support Admin</div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block p-2 mb-2 rounded hover:bg-gray-700 ${
              pathname === item.path ? 'bg-gray-700' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
} 