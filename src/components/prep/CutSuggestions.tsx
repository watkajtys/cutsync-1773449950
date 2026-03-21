import React from 'react';
import { Tag, ChevronDown, ImageOff, PlayCircle } from 'lucide-react';
import { usePrep } from '../../contexts/PrepContext';
import { useVideoPlayback } from '../../contexts/VideoPlaybackContext';
import { formatTimecode } from '../../utils/timeFormat';

export const CutSuggestions: React.FC = () => {
  const { cutSuggestions } = usePrep();
  const { videoRef, setCurrentTime } = useVideoPlayback();

  const handleScrub = (timecode: number) => {
    setCurrentTime(timecode);
    if (videoRef.current) {
      videoRef.current.currentTime = timecode;
    } else {
      const video = document.querySelector('video');
      if (video) video.currentTime = timecode;
    }
  };

  return (
    <div className="w-[440px] flex flex-col bg-[#1A1A1A]/90 backdrop-blur-[16px] rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-2">
          <Tag className="text-[#10b981]" size={16} />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-white/90">AI Cut Suggestions</h3>
        </div>
        <button className="text-white/40 hover:text-white transition-colors">
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-4 space-y-3">
        {cutSuggestions && cutSuggestions.length > 0 ? (
          cutSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="group bg-[#222125] border border-white/5 p-3 rounded-lg hover:border-[#10b981]/40 hover:bg-[#262125] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
              onClick={() => handleScrub(suggestion.start_timecode)}
            >
              <div className="flex gap-4">
                <div className="w-[100px] aspect-video bg-black/60 rounded overflow-hidden flex-shrink-0 relative group-hover:ring-1 group-hover:ring-[#10b981]/50 transition-all">
                  <img alt="Thumbnail" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <PlayCircle className="text-white drop-shadow-md" size={24} />
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[12px] font-bold text-white truncate group-hover:text-[#10b981] transition-colors">
                      {suggestion.cut_reason?.split('.')[0] || 'Cut Suggestion'}
                    </h4>
                    <span className="text-[9px] font-black uppercase text-[#A855F7] tracking-widest bg-[#A855F7]/10 px-2 py-0.5 rounded">
                      Match 98%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-1">{suggestion.cut_reason}</p>
                  <span className="text-[9px] font-mono text-slate-500 opacity-60">
                    {formatTimecode(suggestion.start_timecode, false)} - {formatTimecode(suggestion.end_timecode, false)}
                  </span>
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

      <div className="p-3 border-t border-white/5 bg-black/40 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase text-[#A855F7] tracking-widest">Pocketbase Sync</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Real-Time</span>
        </div>
      </div>
    </div>
  );
};
