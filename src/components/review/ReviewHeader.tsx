import React from 'react';
import { Link } from 'react-router-dom';
import { Database, PlayCircle, Eye, Download, Radio } from 'lucide-react';
import { useReview } from '../../contexts/ReviewContext';
import { formatTimecode } from '../../utils/timeFormat';

export const ReviewHeader: React.FC = () => {
  const { currentTime } = useReview();

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border-subtle bg-surface/80 backdrop-blur-xl z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary p-1 rounded-md flex items-center justify-center">
            <Database className="text-white" size={18} />
          </div>
          <h2 className="text-white text-lg font-black tracking-tight">CutSync PRO</h2>
        </div>
        <nav className="flex items-center gap-1 text-xs font-bold tracking-widest">
          <Link data-testid="nav-workspace" to="/" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-slate-400 hover:text-white transition-colors">
            <PlayCircle size={14} />
            WORKSPACE
          </Link>
          <span className="text-slate-600 mx-1">/</span>
          <span data-testid="nav-review-pipeline" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white bg-white/10 transition-colors cursor-default">
            <Eye size={14} />
            Review Pipeline
          </span>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div data-testid="live-session-indicator" className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-md border border-red-500/20">
          <Radio size={14} className="animate-pulse" />
          LIVE SESSION
        </div>
        
        <button data-testid="export-notes-btn" className="flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-colors px-4 py-1.5 rounded-md">
          <Download size={14} />
          Export Notes
        </button>

        <div className="flex items-center gap-4 bg-black/30 border border-border-subtle rounded-lg px-3 py-1.5 ml-2">
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
