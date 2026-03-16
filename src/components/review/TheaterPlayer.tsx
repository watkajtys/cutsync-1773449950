import React from 'react';
import { Play, FastForward, Rewind, SkipBack, SkipForward, Volume2, Subtitles, Settings, Maximize } from 'lucide-react';

export const TheaterPlayer: React.FC = () => {
  return (
    <section className="flex-1 bg-black flex flex-col relative group">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="video-container w-full max-w-6xl relative bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-white/5" style={{ aspectRatio: '21 / 9' }}>
          <img alt="Silent Horizon Review" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg"/>
          <div className="absolute top-4 left-4 pointer-events-none">
            <div className="flex items-center gap-3">
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-sm font-bold animate-pulse">REC</span>
              <span className="text-[11px] font-mono text-white/60 tracking-tighter">SCENE 04 | TAKE 02 | V03</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-right pointer-events-none">
            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Resolution</p>
            <p className="text-xs font-bold text-white/80">4K DCI (4096 x 1716)</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
            <div className="h-full bg-primary w-[34%] relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-16 bg-surface-accent border-t border-border-subtle flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Rewind size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
            <Play className="fill-current" size={20} />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <FastForward size={20} />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Volume2 className="text-slate-500" size={18} />
            <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="bg-primary w-2/3 h-full"></div>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-border-subtle"></div>
          <div className="flex items-center gap-4">
            <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
              <Subtitles size={18} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
              <Settings size={18} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
