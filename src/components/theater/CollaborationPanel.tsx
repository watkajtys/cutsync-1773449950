import React from 'react';
import { PenTool, CheckCircle, Send } from 'lucide-react';

interface CollaborationPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ isOpen, onToggle }) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-3xl border-t border-white/10 transform transition-transform duration-500 ease-in-out z-40 ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'}`}>
      <div 
        onClick={onToggle}
        className="h-12 flex items-center justify-center cursor-pointer border-b border-white/5 relative"
      >
        <div className="w-12 h-1 bg-white/20 rounded-full absolute top-2"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Collaboration & Review Drawer</span>
      </div>
      <div className="h-64 flex divide-x divide-white/5">
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Active Comments (12)</h4>
            <button className="text-primary text-[10px] font-bold uppercase">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            <div className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-800 flex-shrink-0">
                <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzKhWLSKnAzAauvIwjImoVPnPTt7-K2rcU455fWERDrWZcF8nPI2Q1G38CznoSOoZuwvZ6I01Vb789wHd_c9J01e6L5whT2ItHyaUQaMfx-izq9DyBNaPO5FPxnuh2UxkNcbRMVhQNRdKzrctpCwYbMvGqlOPrugw6B3N9Ot-OyWU131KF-43uxXfwexisEdIJhSoaUz9_ZY9Tw-5_EEBjWATiYcJlclLkKh40HR07xEi22LuZ4wJfpALdgSAPFdU2e0sOIHeZgbM"/>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-200">Sarah J.</span>
                  <span className="text-[10px] font-mono text-primary font-bold">00:12:05</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">The atmospheric mist layer is slightly overpowering the highlights in the left quadrant.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3 p-6 flex flex-col bg-black/20">
          <div className="mb-4">
            <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Quick Actions</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
              <PenTool className="text-slate-400 group-hover:text-primary w-6 h-6" strokeWidth={1.5} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Annotate</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
              <CheckCircle className="text-slate-400 group-hover:text-emerald-500 w-6 h-6" strokeWidth={1.5} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Approve</span>
            </button>
          </div>
          <div className="relative mt-auto">
            <textarea className="w-full bg-surface border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none" placeholder="Drop a note..." rows={2}></textarea>
            <button className="absolute bottom-2 right-2 bg-primary text-white p-1.5 rounded-md">
              <Send className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
