import React from 'react';
import { Database, Settings, Maximize, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChronologicalRiver } from '../components/shared/ChronologicalRiver/index';
import { CollaborationDrawer } from '../components/review/CollaborationDrawer';
import { PlaybackControls } from '../components/theater/PlaybackControls';

export const ReviewView: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'metadata' | 'versions' | 'export' | null>(null);

  return (
    <>
      <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-2xl z-50 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="bg-primary p-1 rounded-md flex items-center justify-center hover:opacity-80 transition-opacity">
              <Database className="text-white w-[18px] h-[18px]" strokeWidth={2} />
            </Link>
            <h2 className="text-white text-lg font-black tracking-tight">CutSync</h2>
          </div>
          <nav className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-md text-slate-400">
              THEATER MODE
            </span>
            <span className="text-slate-800 mx-1">•</span>
            <span className="text-slate-400">CINEMATIC WIDE</span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-3 py-1">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold leading-none mb-0.5">CURRENT TIMECODE</span>
              <span className="text-[13px] font-mono text-white font-medium tracking-widest">00:14:02:11</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden">
            <img alt="User" className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKrR0gaqFvnHYP_Yysmi98tV5mR20XmbS1FPtbP9ShGhx_ybqp2HLKkM8XkPy7oHPd7Qm5DIfdw7akfyiXxhKvXBLulA7ZXN4j3O2qv_52kC5RK6hkcL61b5w6_Qmz8fKTA-uy-S3Y6VeXWXiUZus3orcutLGDrPKKNLJ5EVDzCQBKR3gVImTAVaSzLl79zfLsYU9kUHxuqt3lwVzjE5tb7wbvogw9lzDaHFO1XNT7tXOyUlDxw3alQlUlniwizYEZrOr-tu4o05E" />
          </div>
        </div>
      </header>

      <ChronologicalRiver />

      <main className="flex-1 flex flex-row overflow-hidden bg-black relative">
        <div className="flex-[7] flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="video-container w-full max-w-7xl relative bg-black shadow-[0_0_100px_rgba(0,0,0,1)] ring-1 ring-white/5">
            <img alt="Cinematic Content" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            
            <div className="absolute top-6 left-6 flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Project</span>
                <span className="text-xs text-white/80 font-medium">SILENT HORIZON_V03.mxf</span>
              </div>
            </div>

            <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-md px-3 py-1 rounded shadow-lg">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Live Review</span>
              </div>
              <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
                <span className="text-[10px] font-mono text-white/80 tracking-widest">4K DCI</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="text-[10px] font-mono text-white/80 tracking-widest">23.976 FPS</span>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 text-right">
              <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Ratio</span>
              <p className="text-xs text-white/80 font-medium tracking-tight">2.39:1 Cinemascope</p>
            </div>
          </div>

          <PlaybackControls activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab && (
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-surface/95 backdrop-blur-3xl border-l border-white/10 z-[100] p-6 pointer-events-auto shadow-2xl transition-transform">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white" data-testid="active-tab-panel-title">
                  {activeTab} PANEL
                </h3>
                <button onClick={() => setActiveTab(null)} className="text-slate-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <div className="text-slate-400 text-sm">
                <p>Content for {activeTab} goes here...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-[3] border-l border-white/5 bg-surface/90 relative z-40">
          <CollaborationDrawer />
        </div>
      </main>

      <footer className="h-8 bg-black border-t border-white/5 px-6 flex items-center justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest z-[150] relative">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            ACTIVE SESSION: ALEX_RIVERS
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-[12px]" />
            SYNCED: 42.1 MS LATENCY
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Settings className="w-5 h-5 hover:text-white cursor-pointer transition-colors" strokeWidth={2} />
            <Maximize className="w-5 h-5 hover:text-white cursor-pointer transition-colors" strokeWidth={2} />
          </div>
          <div className="text-slate-800">BUILD 0.92-ALPHA</div>
        </div>
      </footer>
    </>
  );
};
