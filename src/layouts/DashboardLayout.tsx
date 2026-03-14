import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Film, LayoutGrid, Settings, Folder } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Film size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              CutSync
            </h1>
          </div>

          <div className="space-y-2">
            <NavLink 
              to="/projects"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`
              }
            >
              <LayoutGrid size={18} />
              Projects
            </NavLink>
            <NavLink 
              to="/recent"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`
              }
            >
              <Folder size={18} />
              Recent Assets
            </NavLink>
          </div>
        </div>

        <div className="p-6">
          <NavLink 
            to="/settings"
            className={({ isActive }) => 
              `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive ? 'bg-blue-600/10 text-blue-400 font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
};
