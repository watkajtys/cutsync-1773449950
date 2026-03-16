import React from 'react';
import { Play, SkipBack, SkipForward, Info, Layers, Download } from 'lucide-react';

interface PlaybackControlsProps {
  activeTab: 'metadata' | 'versions' | 'export' | null;
  setActiveTab: (tab: 'metadata' | 'versions' | 'export' | null) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mt-8 flex flex-col items-center gap-6 z-[100] relative pointer-events-auto">
      <div className="flex items-center gap-12">
        <button className="text-slate-500 hover:text-white transition-colors">
          <SkipBack className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
          <Play className="w-8 h-8 fill-black translate-x-0.5" strokeWidth={1.5} />
        </button>
        <button className="text-slate-500 hover:text-white transition-colors">
          <SkipForward className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>
      <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-slate-400">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 transition-colors uppercase relative z-[200] ${activeTab === 'metadata' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 hover:bg-white/10 hover:text-white'}`}
          onClick={() => setActiveTab(activeTab === 'metadata' ? null : 'metadata')}
          data-testid="nav-btn-metadata"
        >
          <Info className="w-3.5 h-3.5" strokeWidth={2} />
          Metadata
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 transition-colors uppercase relative z-[200] ${activeTab === 'versions' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 hover:bg-white/10 hover:text-white'}`}
          onClick={() => setActiveTab(activeTab === 'versions' ? null : 'versions')}
          data-testid="nav-btn-versions"
        >
          <Layers className="w-3.5 h-3.5" strokeWidth={2} />
          Versions
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 transition-colors uppercase relative z-[200] ${activeTab === 'export' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 hover:bg-white/10 hover:text-white'}`}
          onClick={() => setActiveTab(activeTab === 'export' ? null : 'export')}
          data-testid="nav-btn-export"
        >
          <Download className="w-3.5 h-3.5" strokeWidth={2} />
          Export
        </button>
      </div>
    </div>
  );
};
