import React from 'react';
import { History, Settings, Maximize, BrainCircuit } from 'lucide-react';

export const PrepFooter: React.FC = () => {
  return (
    <footer className="h-8 bg-black border-t border-white/5 px-6 flex items-center justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          ACTIVE PREP: ALEX_RIVERS
        </div>
        <div className="flex items-center gap-2">
          <BrainCircuit size={12} />
          AI PROCESSING: OPTIMIZED
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <History className="hover:text-white cursor-pointer transition-colors" size={16} />
          <Settings className="hover:text-white cursor-pointer transition-colors" size={16} />
          <Maximize className="hover:text-white cursor-pointer transition-colors" size={16} />
        </div>
        <div className="text-slate-800">BUILD 0.92-BETA</div>
      </div>
    </footer>
  );
};
