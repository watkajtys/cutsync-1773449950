import React from 'react';
import { Eye, Paperclip, Send } from 'lucide-react';

export const NotesSidebar: React.FC = () => {
  return (
    <aside className="w-[400px] border-l border-border-subtle bg-surface flex flex-col">
      <div className="flex border-b border-border-subtle">
        <button className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-primary border-b-2 border-primary">
          Comments
        </button>
        <button className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
          History
        </button>
        <button className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
          Metadata
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full overflow-hidden border border-border-subtle flex-shrink-0">
              <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzKhWLSKnAzAauvIwjImoVPnPTt7-K2rcU455fWERDrWZcF8nPI2Q1G38CznoSOoZuwvZ6I01Vb789wHd_c9J01e6L5whT2ItHyaUQaMfx-izq9DyBNaPO5FPxnuh2UxkNcbRMVhQNRdKzrctpCwYbMvGqlOPrugw6B3N9Ot-OyWU131KF-43uxXfwexisEdIJhSoaUz9_ZY9Tw-5_EEBjWATiYcJlclLkKh40HR07xEi22LuZ4wJfpALdgSAPFdU2e0sOIHeZgbM"/>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">Sarah Jenkins</span>
                <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 bg-primary/10 rounded">00:12:05</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-2">The mist in the background feels a bit too heavy. Can we dial down the atmospheric layer by 15%?</p>
              <div className="flex items-center gap-4">
                <button className="text-[10px] font-bold text-slate-500 hover:text-primary uppercase tracking-wider">Reply</button>
                <button className="text-[10px] font-bold text-slate-500 hover:text-emerald-400 uppercase tracking-wider">Resolve</button>
              </div>
            </div>
          </div>
          <div className="pl-11">
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full overflow-hidden border border-border-subtle flex-shrink-0">
                <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKrR0gaqFvnHYP_Yysmi98tV5mR20XmbS1FPtbP9ShGhx_ybqp2HLKkM8XkPy7oHPd7Qm5DIfdw7akfyiXxhKvXBLulA7ZXN4j3O2qv_52kC5RK6hkcL61b5w6_Qmz8fKTA-uy-S3Y6VeXWXiUZus3orcutLGDrPKKNLJ5EVDzCQBKR3gVImTAVaSzLl79zfLsYU9kUHxuqt3lwVzjE5tb7wbvogw9lzDaHFO1XNT7tXOyUlDxw3alQlUlniwizYEZrOr-tu4o05E"/>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-slate-300">Alex Rivers</span>
                  <span className="text-[9px] text-slate-500 uppercase">2h ago</span>
                </div>
                <p className="text-xs text-slate-500">Agreed. I'll adjust the depth matte in the composite.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[1px] bg-border-subtle"></div>
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white flex-shrink-0">
            <Eye size={14} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-200">Velocity Client</span>
              <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 bg-primary/10 rounded">00:13:44</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">Let's hold on this frame for 12 more frames to catch the peak of the flare.</p>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-border-subtle bg-surface-accent">
        <div className="relative">
          <textarea className="w-full bg-surface border border-border-subtle rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none" placeholder="Add a comment at 00:14:02:11..." rows={3}></textarea>
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button className="text-slate-500 hover:text-slate-300">
              <Paperclip size={18} />
            </button>
            <button className="bg-primary hover:bg-primary/90 text-white p-1.5 rounded-md transition-all">
              <Send className="fill-current" size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
