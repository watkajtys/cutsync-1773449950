import React from 'react';
import { Tag, ChevronDown, ImageOff, PlayCircle, GalleryVerticalEnd } from 'lucide-react';
import { usePrep } from '../../contexts/PrepContext';
import { useVideoPlayback } from '../../contexts/VideoPlaybackContext';
import { formatTimecode } from '../../utils/timeFormat';

export const CutSuggestions: React.FC = () => {
  const { cutSuggestions } = usePrep();
  const { setCurrentTime } = useVideoPlayback();

  return (
    <div className="w-96 flex flex-col backdrop-blur-[12px] bg-panel-dark/85 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GalleryVerticalEnd className="text-markup-green" size={18} />
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-200">Smart Cut Suggestions</h3>
        </div>
        <button className="text-slate-500 hover:text-white transition-colors">
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-4 space-y-3">
        {cutSuggestions && cutSuggestions.length > 0 ? (
          cutSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-prep-purple/40 transition-all cursor-pointer group"
              onClick={() => setCurrentTime(suggestion.start_timecode)}
            >
              <div className="size-12 rounded bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 relative">
                <img alt="cut thumb" className="w-full h-full object-cover group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD98H2eY7T-H_6E4XvO6zUj-f1k6xZ9L6mY_H6v-V1Xq4" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <PlayCircle className="text-white drop-shadow-md" size={16} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-200 truncate pr-2 group-hover:text-prep-purple transition-colors">
                    {suggestion.cut_reason?.split('.')[0] || 'Cut Suggestion'}
                  </span>
                  <span className="text-[9px] font-mono text-prep-purple whitespace-nowrap">
                    MATCH 88%
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 mt-1 line-clamp-2">{suggestion.cut_reason}</p>
                <span className="text-[9px] font-mono text-slate-500 opacity-60 mt-1 block">
                  {formatTimecode(suggestion.start_timecode, false)} - {formatTimecode(suggestion.end_timecode, false)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-prep-purple/40 transition-all cursor-pointer">
            <div className="size-12 bg-slate-800 rounded relative overflow-hidden flex-shrink-0 text-center flex flex-col items-center justify-center border border-white/10">
              <ImageOff className="text-slate-600 mb-1" size={16} />
              <span className="text-[8px] uppercase font-bold text-slate-600 mt-1">Wait</span>
            </div>
            <div className="flex-1">
              <div className="h-2 w-16 bg-white/5 rounded mb-2 animate-pulse"></div>
              <div className="h-2 w-3/4 bg-white/5 rounded mb-2 animate-pulse"></div>
              <div className="h-2 w-1/2 bg-white/5 rounded animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-prep-purple/5 flex justify-between items-center rounded-b-xl border-t border-white/5">
        <span className="text-[10px] font-bold text-prep-purple uppercase tracking-widest">PocketBase Sync</span>
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 bg-markup-green rounded-full shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Real-time</span>
        </div>
      </div>
    </div>
  );
};
