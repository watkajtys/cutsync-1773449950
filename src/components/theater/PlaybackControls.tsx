import React from 'react';
import { Play, SkipBack, SkipForward } from 'lucide-react';

interface PlaybackControlsProps {
  activeTab: 'metadata' | 'versions' | 'export' | null;
  setActiveTab: (tab: 'metadata' | 'versions' | 'export' | null) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mt-8 flex flex-col items-center gap-6 z-[100] relative pointer-events-auto">
      <div className="flex items-center gap-12 px-8 py-4 rounded-3xl border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md">
        <button className="text-slate-500 hover:text-white transition-colors">
          <SkipBack className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <button className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(43,108,238,0.4)] border border-primary/50">
          <Play className="w-8 h-8 fill-white translate-x-0.5" strokeWidth={1.5} />
        </button>
        <button className="text-slate-500 hover:text-white transition-colors">
          <SkipForward className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>
      <div className="flex items-center gap-4 text-[11px] font-bold tracking-[0.2em] text-slate-400">
        <button
          className={`px-5 py-2 rounded-full border transition-all uppercase relative z-[200] ${activeTab === 'metadata' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-transparent hover:bg-white/10 hover:text-white'}`}
          onClick={() => setActiveTab(activeTab === 'metadata' ? null : 'metadata')}
          data-testid="nav-btn-metadata"
        >
          Metadata
        </button>
        <button
          className={`px-5 py-2 rounded-full border transition-all uppercase relative z-[200] ${activeTab === 'versions' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-transparent hover:bg-white/10 hover:text-white'}`}
          onClick={() => setActiveTab(activeTab === 'versions' ? null : 'versions')}
          data-testid="nav-btn-versions"
        >
          Versions
        </button>
        <button
          className={`px-5 py-2 rounded-full border transition-all uppercase relative z-[200] ${activeTab === 'export' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-transparent hover:bg-white/10 hover:text-white'}`}
          onClick={() => setActiveTab(activeTab === 'export' ? null : 'export')}
          data-testid="nav-btn-export"
        >
          Export
        </button>
      </div>
    </div>
  );
};
