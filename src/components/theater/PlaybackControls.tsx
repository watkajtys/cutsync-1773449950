import React from 'react';
import { Play, SkipBack, SkipForward, Info, Layers, Download } from 'lucide-react';

export const PlaybackControls: React.FC = () => {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 w-full">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-8 py-3 flex items-center justify-between gap-12 shadow-2xl">
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-slate-500">
          <button className="flex items-center gap-2 hover:text-white transition-colors uppercase group">
            <Info className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
            <span className="hidden sm:inline">Metadata</span>
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors uppercase group">
            <Layers className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
            <span className="hidden sm:inline">Versions</span>
          </button>
        </div>

        <div className="flex items-center gap-8">
          <button className="text-slate-400 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5" strokeWidth={2} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Play className="w-6 h-6 fill-black translate-x-0.5" strokeWidth={1} />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-slate-500">
          <button className="flex items-center gap-2 hover:text-white transition-colors uppercase group">
            <Download className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};
