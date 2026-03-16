import React from 'react';
import { Info, ListFilter, Send } from 'lucide-react';

export const NotesSidebar: React.FC = () => {
  return (
    <aside className="w-80 border-l border-white/5 bg-surface flex flex-col">
      <section className="h-[45%] flex flex-col border-b border-white/5">
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

      <section className="h-[55%] flex flex-col">
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Review Notes (4)</h3>
          <div className="flex gap-2">
            <button className="text-slate-500 hover:text-white transition-colors">
              <ListFilter size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <div className="group relative bg-white/5 p-3 rounded-lg border border-white/5 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 rounded bg-primary/10">00:12:05:00</span>
              <span className="text-[9px] text-slate-500 font-bold">2m ago</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-primary/30 pl-2">"Adjust color grade on this shot. Shadows are slightly crushed."</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-4 w-4 rounded-full overflow-hidden">
                <img alt="Sarah" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzKhWLSKnAzAauvIwjImoVPnPTt7-K2rcU455fWERDrWZcF8nPI2Q1G38CznoSOoZuwvZ6I01Vb789wHd_c9J01e6L5whT2ItHyaUQaMfx-izq9DyBNaPO5FPxnuh2UxkNcbRMVhQNRdKzrctpCwYbMvGqlOPrugw6B3N9Ot-OyWU131KF-43uxXfwexisEdIJhSoaUz9_ZY9Tw-5_EEBjWATiYcJlclLkKh40HR07xEi22LuZ4wJfpALdgSAPFdU2e0sOIHeZgbM"/>
              </div>
              <span className="text-[10px] font-medium text-slate-400">Sarah J.</span>
            </div>
          </div>

          <div className="group relative bg-white/5 p-3 rounded-lg border border-white/5 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 rounded bg-primary/10">00:14:05:12</span>
              <span className="text-[9px] text-slate-500 font-bold">1h ago</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">Audio peak at 00:14:05. Needs level normalization.</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-slate-800 flex items-center justify-center">
                <span className="text-[8px] text-white">MK</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400">Mark K.</span>
            </div>
          </div>

          <div className="group relative bg-white/5 p-3 rounded-lg border border-white/5 hover:border-primary/50 transition-colors cursor-pointer opacity-60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 font-bold px-1.5 py-0.5 rounded bg-white/5">00:15:22:00</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase">Resolved</span>
            </div>
            <p className="text-xs text-slate-400 line-through">Check boom mic shadow in bottom right.</p>
          </div>
        </div>
        
        <div className="p-4 bg-black/40 border-t border-white/5">
          <div className="relative">
            <textarea className="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none h-16" placeholder="Add note at 00:14:02:11..."></textarea>
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <button className="bg-primary hover:bg-primary/90 text-white p-1 rounded transition-colors">
                <Send size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};
