import React from 'react';
import { Link } from 'react-router-dom';
import { Database, PlayCircle, Eye, Download, Radio } from 'lucide-react';
import { useReview } from '../../contexts/ReviewContext';
import { formatTimecode } from '../../utils/timeFormat';

export const ReviewHeader: React.FC = () => {
  const { currentTime } = useReview();

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border-subtle bg-[#0c0e14]/40 backdrop-blur-[12px] bg-white/[0.02] shadow-[0_4px_24px_-12px_rgba(0,0,0,0.5)] z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-1.5 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/20">
            <Database className="text-white" size={16} strokeWidth={1.5} />
          </div>
          <h2 className="text-white text-lg font-black tracking-tight drop-shadow-md">CutSync</h2>
        </div>
        <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]">
          <Link to="/" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-blue-400 bg-blue-600/10 hover:bg-blue-600/20 transition-colors border border-blue-500/10 shadow-inner">
            <PlayCircle size={14} strokeWidth={1.5} />
            Current Project
          </Link>
          <span className="text-slate-700 mx-1">/</span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-md text-slate-300 hover:text-white transition-colors cursor-default bg-white/5 border border-white/5 shadow-inner">
            <Eye size={14} strokeWidth={1.5} />
            Review & Approval
          </span>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col w-32 justify-center mr-2">
          <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
            <span>Proxy & Cache</span>
            <span className="text-blue-400 font-black">100%</span>
          </div>
          <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5">
            <div className="h-full bg-blue-500 w-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-md text-xs font-bold uppercase tracking-widest transition-colors border border-white/10">
            <Download size={14} className="text-slate-400" />
            Export Notes
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-md text-xs font-bold uppercase tracking-widest transition-colors border border-primary/20">
            <Radio size={14} className="animate-pulse" />
            Live Session
          </button>
        </div>

        <div className="flex items-center gap-4 bg-black/30 border border-border-subtle rounded-lg px-3 py-1.5 border-l border-border-subtle pl-6 ml-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold leading-none">TIMECODE</span>
            <span className="text-sm font-mono text-emerald-400 font-bold">{formatTimecode(currentTime)}</span>
          </div>
          <div className="w-[1px] h-6 bg-border-subtle"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold leading-none">FRAME</span>
            <span className="text-sm font-mono text-white font-bold">{Math.floor(currentTime * 24).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 border-l border-border-subtle pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">Alex Rivers</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Reviewer</p>
          </div>
          <div className="h-8 w-8 rounded-full border border-primary/40 overflow-hidden">
            <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKrR0gaqFvnHYP_Yysmi98tV5mR20XmbS1FPtbP9ShGhx_ybqp2HLKkM8XkPy7oHPd7Qm5DIfdw7akfyiXxhKvXBLulA7ZXN4j3O2qv_52kC5RK6hkcL61b5w6_Qmz8fKTA-uy-S3Y6VeXWXiUZus3orcutLGDrPKKNLJ5EVDzCQBKR3gVImTAVaSzLl79zfLsYU9kUHxuqt3lwVzjE5tb7wbvogw9lzDaHFO1XNT7tXOyUlDxw3alQlUlniwizYEZrOr-tu4o05E"/>
          </div>
        </div>
      </div>
    </header>
  );
};
