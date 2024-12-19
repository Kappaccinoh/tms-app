export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-xl font-bold text-white">Enterprise Support Console</div>
            <div className="ml-8 flex space-x-4">
              <span className="text-gray-300 hover:text-white px-3 py-2 text-sm">Dashboard</span>
              <span className="text-gray-400 hover:text-white px-3 py-2 text-sm">Analytics</span>
              <span className="text-gray-400 hover:text-white px-3 py-2 text-sm">Reports</span>
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