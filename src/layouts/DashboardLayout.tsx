import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Film, LayoutGrid, Settings, Folder, PlayCircle } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-slate-900/40 backdrop-blur-[12px] bg-white/[0.02] border-r border-slate-800/50 flex-col justify-between hidden md:flex shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/20">
              <Film size={20} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
              CutSync
            </h1>
          </div>

          <div className="space-y-1.5">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 mt-4">Library</p>
            <NavLink 
              to="/projects"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-blue-600/15 text-blue-400 font-semibold shadow-inner border border-blue-500/20' : 'text-slate-400 font-medium hover:text-white hover:bg-white/5'}`
              }
            >
              <LayoutGrid size={18} strokeWidth={1.5} />
              Workspaces
            </NavLink>
            <NavLink 
              to="/recent"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-blue-600/15 text-blue-400 font-semibold shadow-inner border border-blue-500/20' : 'text-slate-400 font-medium hover:text-white hover:bg-white/5'}`
              }
            >
              <Folder size={18} strokeWidth={1.5} />
              Recent Media
            </NavLink>
            
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 mt-6">Workflow</p>
            <NavLink 
              to="/review/test-asset"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-blue-600/15 text-blue-400 font-semibold shadow-inner border border-blue-500/20' : 'text-slate-400 font-medium hover:text-white hover:bg-white/5'}`
              }
            >
              <PlayCircle size={18} strokeWidth={1.5} />
              Review & Approval
            </NavLink>
            <NavLink 
              to="/polish/test-asset"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-blue-600/15 text-blue-400 font-semibold shadow-inner border border-blue-500/20' : 'text-slate-400 font-medium hover:text-white hover:bg-white/5'}`
              }
            >
              <Film size={18} strokeWidth={1.5} />
              Finalize & Deliver
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
