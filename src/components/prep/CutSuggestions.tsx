import React from 'react';
import { Wand2, PlayCircle, ImageOff } from 'lucide-react';
import { usePrep } from '../../contexts/PrepContext';
import { formatTimecode } from '../../utils/timeFormat';

export const CutSuggestions: React.FC = () => {
  const { cutSuggestions, setCurrentTime } = usePrep();

  return (
    <div className="w-1/2 flex flex-col border-r border-white/5 bg-surface">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="text-primary" size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white/80">AI Cut Suggestions</h3>
        </div>
        <div className="flex gap-2">
          <button className="px-2 py-0.5 text-[9px] font-bold bg-white/5 rounded hover:bg-white/10 border border-white/10 transition-colors uppercase">Sort by Relevance</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {cutSuggestions.length > 0 ? (
          cutSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="group bg-white/5 border border-white/5 p-3 rounded-lg hover:border-primary/40 transition-all cursor-pointer"
              onClick={() => setCurrentTime(suggestion.start_timecode)}
            >
              <div className="flex gap-4">
                <div className="w-32 aspect-video bg-neutral-800 rounded relative overflow-hidden flex-shrink-0">
                  <img alt="Thumbnail" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="text-white" size={24} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-tight ${suggestion.cut_reason?.toLowerCase().includes('technical') || suggestion.cut_reason?.toLowerCase().includes('stable') || suggestion.cut_reason?.toLowerCase().includes('wide') ? 'text-emerald-500' : 'text-primary'}`}>
                      {suggestion.cut_reason?.toLowerCase().includes('technical') || suggestion.cut_reason?.toLowerCase().includes('stable') || suggestion.cut_reason?.toLowerCase().includes('wide') ? 'Technical' : 'Emotional Peak'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {formatTimecode(suggestion.start_timecode, false)} - {formatTimecode(suggestion.end_timecode, false)}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate mb-1">
                    {suggestion.cut_reason?.split('.')[0] || 'Cut Suggestion'}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{suggestion.cut_reason}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="group bg-white/5 border border-white/5 p-3 rounded-lg hover:border-primary/40 transition-all cursor-pointer">
            <div className="flex gap-4">
              <div className="w-32 aspect-video bg-neutral-800 rounded relative overflow-hidden flex-shrink-0 text-center flex flex-col items-center justify-center border border-white/5">
                <ImageOff className="text-slate-600 mb-1" size={24} />
                <span className="text-[8px] uppercase font-bold text-slate-600 mt-1">Generating</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-2 w-16 bg-white/5 rounded mb-2 animate-pulse"></div>
                <div className="h-3 w-3/4 bg-white/5 rounded mb-2 animate-pulse"></div>
                <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
