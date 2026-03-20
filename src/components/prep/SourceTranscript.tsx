import React from 'react';
import { FileText, Search, X } from 'lucide-react';
import { usePrep } from '../../contexts/PrepContext';
import { useVideoPlayback } from '../../contexts/VideoPlaybackContext';
import { formatTimecode } from '../../utils/timeFormat';

export const SourceTranscript: React.FC = () => {
  const { transcripts } = usePrep();
  const { currentTime, setCurrentTime } = useVideoPlayback();

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] w-[320px] text-slate-300">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="text-[#A855F7]" size={16} />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-white/90">Source Transcript</h3>
        </div>
        <button className="text-white/40 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        <div className="space-y-4">
          {transcripts && transcripts.length > 0 ? (
            transcripts.map((transcript, index) => {
              const mockTime = index * 10;
              const isActive = currentTime >= mockTime && currentTime < mockTime + 10;
              
              let speaker = "";
              let content = transcript.raw_text || "";
              const speakerMatch = content.match(/^([A-Z\s]+):(.*)/);
              if (speakerMatch) {
                speaker = speakerMatch[1].trim();
                content = speakerMatch[2].trim();
              }
              
              const isItalic = content.startsWith("[") && content.endsWith("]");

              return (
              <div 
                key={transcript.id} 
                className={`transcript-line group flex flex-col gap-2 cursor-pointer ${isActive ? 'bg-[#26212F] p-4 rounded-lg border border-[#A855F7]/30 shadow-[0_4px_20px_rgba(168,85,247,0.05)]' : 'p-2 hover:bg-white/5 rounded-lg transition-colors'}`}
                onClick={() => setCurrentTime(mockTime)}
              >
                <span className={`timestamp text-[10px] font-mono font-bold ${isActive ? 'text-[#A855F7]' : 'text-[#A855F7] opacity-60'}`}>
                  {formatTimecode(mockTime, false)}
                </span>
                <div>
                  <p className={`text-[13px] leading-relaxed ${isActive ? 'text-white' : 'text-slate-400'} ${isItalic ? 'italic' : ''}`}>
                    {speaker && <span className={`${isActive ? 'text-[#A855F7] font-bold' : 'text-white font-semibold'}`}>{speaker}: </span>}
                    {content}
                  </p>
                  {isActive && (
                    <div className="mt-3 flex gap-2">
                      <span className="px-2 py-1 rounded bg-[#A855F7]/10 text-[9px] font-bold text-[#A855F7] uppercase tracking-wider">Keywords: Dusty</span>
                      <span className="px-2 py-1 rounded bg-[#A855F7]/10 text-[9px] font-bold text-[#A855F7] uppercase tracking-wider">Action: Reach</span>
                    </div>
                  )}
                </div>
              </div>
            )})
          ) : (
            <div className="text-center text-slate-500 text-sm mt-10">No transcript available</div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search transcript..." 
            className="w-full bg-[#111111] border border-white/10 rounded-lg py-2 pl-3 pr-8 text-[11px] text-white/80 focus:outline-none focus:border-[#A855F7]/50 focus:ring-1 focus:ring-[#A855F7]/50 transition-all placeholder:text-white/30"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
        </div>
      </div>
    </div>
  );
};
