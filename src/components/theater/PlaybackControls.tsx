import React from 'react';
import { Play, SkipBack, SkipForward } from 'lucide-react';

export const PlaybackControls: React.FC = () => {
  return (
    <div className="mt-8 flex flex-col items-center gap-6">
      <div className="flex items-center gap-12">
        <button className="text-slate-500 hover:text-white transition-colors">
          <SkipBack className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
          <Play className="w-8 h-8 fill-black" strokeWidth={1} />
        </button>
        <button className="text-slate-500 hover:text-white transition-colors">
          <SkipForward className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>
      <div className="flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-slate-600">
        <button className="hover:text-primary transition-colors uppercase">Metadata</button>
        <button className="hover:text-primary transition-colors uppercase">Versions</button>
        <button className="hover:text-primary transition-colors uppercase">Export</button>
      </div>
    </div>
  );
};
