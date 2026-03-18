import React from 'react';
import { Info } from 'lucide-react';

export const TechnicalMetadata: React.FC = () => {
  return (
    <section className="h-[40%] flex flex-col border-t border-white/5">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Technical Metadata</h3>
        <Info className="text-slate-500" size={14} strokeWidth={1.5} />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        <div>
          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">File Info</span>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Codec</span>
              <span className="text-white font-mono">Apple ProRes 4444 XQ</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Resolution</span>
              <span className="text-white font-mono">4096 x 1716</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Frame Rate</span>
              <span className="text-white font-mono">23.976 fps</span>
            </div>
          </div>
        </div>
        
        <div>
          <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Color Space</span>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Gamma</span>
              <span className="text-white font-mono">LogC4</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Gamut</span>
              <span className="text-white font-mono">ARRI Wide Gamut 4</span>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="p-3 bg-white/5 rounded border border-white/5">
            <span className="text-[9px] font-bold text-emerald-500 uppercase block mb-1">Status</span>
            <p className="text-[11px] text-slate-300">Awaiting Final VFX Compositing for shots 024-031</p>
          </div>
        </div>
      </div>
    </section>
  );
};
