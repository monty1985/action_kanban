import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AppTile {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

const AppsPage: React.FC = () => {
  const navigate = useNavigate();

  const apps: AppTile[] = [
    {
      id: 'action-kanban',
      name: 'Action Kanban',
      description: 'Manage your tasks and actions efficiently',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="kanbanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#00ff88', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#00a8ff', stopOpacity:1}} />
            </linearGradient>
          </defs>
          <rect x="10" y="25" width="20" height="50" rx="4" fill="url(#kanbanGrad)" opacity="0.8"/>
          <rect x="35" y="15" width="20" height="60" rx="4" fill="url(#kanbanGrad)" opacity="0.6"/>
          <rect x="60" y="20" width="20" height="55" rx="4" fill="url(#kanbanGrad)" opacity="0.4"/>
          <rect x="85" y="30" width="10" height="45" rx="4" fill="url(#kanbanGrad)" opacity="0.9"/>
        </svg>
      ),
      route: '/action-kanban',
      color: 'from-[#00ff88] to-[#00a8ff]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="appLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#00ff88', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#00a8ff', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <rect x="15" y="15" width="30" height="30" rx="6" fill="url(#appLogoGrad)" opacity="0.8"/>
              <rect x="55" y="15" width="30" height="30" rx="6" fill="url(#appLogoGrad)" opacity="0.6"/>
              <rect x="15" y="55" width="30" height="30" rx="6" fill="url(#appLogoGrad)" opacity="0.6"/>
              <rect x="55" y="55" width="30" height="30" rx="6" fill="url(#appLogoGrad)" opacity="0.4"/>
            </svg>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00a8ff] bg-clip-text text-transparent">
              Your Productivity Apps
            </h1>
          </div>
          <p className="mt-2 text-gray-400">All your productivity tools in one place</p>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(app.route)}
              className="glass-card p-6 cursor-pointer hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] group-hover:from-[#2a2a2a] group-hover:to-[#3a3a3a] transition-all duration-300">
                  {app.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{app.name}</h3>
                <p className="text-gray-400 text-sm">{app.description}</p>
                <div className={`mt-4 h-1 w-20 rounded-full bg-gradient-to-r ${app.color} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
          
          {/* Add New App Tile */}
          <div
            className="glass-card p-6 cursor-pointer hover:scale-105 transition-all duration-300 border-dashed border-2 border-[#3a3a3a] hover:border-[#00ff88]/50 group flex items-center justify-center"
            onClick={() => alert('Add new app functionality coming soon!')}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] group-hover:from-[#2a2a2a] group-hover:to-[#3a3a3a] transition-all duration-300">
                <svg className="w-12 h-12 text-gray-500 group-hover:text-[#00ff88] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-500 group-hover:text-white transition-colors duration-300">Add New App</h3>
              <p className="text-gray-600 text-sm mt-2 group-hover:text-gray-400 transition-colors duration-300">Coming soon</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppsPage;