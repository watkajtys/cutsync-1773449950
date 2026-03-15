import React from 'react';
import { Play, SkipBack, SkipForward } from 'lucide-react';

interface PlaybackControlsProps {
  activeTab: 'metadata' | 'versions' | 'export' | null;
  setActiveTab: (tab: 'metadata' | 'versions' | 'export' | null) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mt-8 flex flex-col items-center gap-6 z-[100] relative pointer-events-auto">
      <div className="flex items-center gap-12">
        <button className="text-slate-500 hover:text-white transition-colors">
          <SkipBack className="w-6 h-6" strokeWidth={2} />
        </button>
        <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
          <Play className="w-8 h-8 fill-black translate-x-0.5" strokeWidth={1} />
        </button>
        <button className="text-slate-500 hover:text-white transition-colors">
          <SkipForward className="w-6 h-6" strokeWidth={2} />
        </button>
      </div>
      <div className="flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-slate-600">
        <button
          className={`hover:text-primary transition-colors uppercase ${activeTab === 'metadata' ? 'text-primary' : ''} relative z-50`}
          onClick={() => setActiveTab(activeTab === 'metadata' ? null : 'metadata')}
          data-testid="nav-btn-metadata"
        >
          Metadata
        </button>
        <button
          className={`hover:text-primary transition-colors uppercase ${activeTab === 'versions' ? 'text-primary' : ''} relative z-50`}
          onClick={() => setActiveTab(activeTab === 'versions' ? null : 'versions')}
          data-testid="nav-btn-versions"
        >
          Versions
        </button>
        <button
          className={`hover:text-primary transition-colors uppercase ${activeTab === 'export' ? 'text-primary' : ''} relative z-50`}
          onClick={() => setActiveTab(activeTab === 'export' ? null : 'export')}
          data-testid="nav-btn-export"
        >
          Export
        </button>
      </div>
    </div>
  );
};
