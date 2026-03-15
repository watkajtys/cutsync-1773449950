import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Database, 
  Settings, Maximize, Activity
} from 'lucide-react';
import { ChronologicalRiver } from '../components/shared/ChronologicalRiver/index';
import { CollaborationPanel } from '../components/theater/CollaborationPanel';
import { PlaybackControls } from '../components/theater/PlaybackControls';

export const ReviewView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDrawerOpen = searchParams.get('drawer') === 'collaboration';

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      searchParams.delete('drawer');
    } else {
      searchParams.set('drawer', 'collaboration');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="text-slate-300 h-screen overflow-hidden flex flex-col bg-[#050608] w-full">
      <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-2xl z-50">
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
            <span className="text-primary">CINEMATIC WIDE</span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-4 py-1.5">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold leading-none mb-1">CURRENT TIMECODE</span>
              <span className="text-sm font-mono text-white font-medium tracking-widest">00:14:02:11</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden">
            <img alt="User" className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKrR0gaqFvnHYP_Yysmi98tV5mR20XmbS1FPtbP9ShGhx_ybqp2HLKkM8XkPy7oHPd7Qm5DIfdw7akfyiXxhKvXBLulA7ZXN4j3O2qv_52kC5RK6hkcL61b5w6_Qmz8fKTA-uy-S3Y6VeXWXiUZus3orcutLGDrPKKNLJ5EVDzCQBKR3gVImTAVaSzLl79zfLsYU9kUHxuqt3lwVzjE5tb7wbvogw9lzDaHFO1XNT7tXOyUlDxw3alQlUlniwizYEZrOr-tu4o05E"/>
          </div>
        </div>
      </header>

      <ChronologicalRiver />

      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-black relative overflow-hidden">
        <div className="video-container w-full max-w-7xl relative bg-black shadow-[0_0_100px_rgba(0,0,0,1)] ring-1 ring-white/5" style={{ aspectRatio: '21 / 9' }}>
          <img alt="Cinematic Content" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          <div className="absolute top-6 left-6 flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Project</span>
              <span className="text-xs text-white/80 font-medium">SILENT HORIZON_V03.mxf</span>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 text-right">
            <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Ratio</span>
            <p className="text-xs text-white/80 font-medium tracking-tight">2.39:1 Cinemascope</p>
          </div>
        </div>

        <PlaybackControls />

        <CollaborationPanel isOpen={isDrawerOpen} onToggle={toggleDrawer} />
      </main>

      <footer className="h-8 bg-black border-t border-white/5 px-6 flex items-center justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            ACTIVE SESSION: ALEX_RIVERS
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            SYNCED: 42.1 MS LATENCY
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Settings className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
            <Maximize className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          </div>
          <div className="text-slate-800">BUILD 0.92-ALPHA</div>
        </div>
      </footer>
    </div>
  );
};
