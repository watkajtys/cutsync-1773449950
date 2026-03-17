import React from 'react';
import { AlignLeft, Search } from 'lucide-react';
import { usePrep } from '../../contexts/PrepContext';
import { formatTimecode } from '../../utils/timeFormat';

export const SourceTranscript: React.FC = () => {
  const { transcripts, currentTime, setCurrentTime } = usePrep();

  return (
    <div className="w-1/2 flex flex-col bg-surface-accent">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlignLeft className="text-slate-400" size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white/80">Source Transcript</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">English (US)</span>
          <button className="text-slate-500 hover:text-white transition-colors">
            <Search size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 font-display">
        <div className="space-y-4">
          {transcripts.length > 0 ? (
            transcripts.map((transcript, index) => {
              // Estimate or parse a timestamp from the transcript data, since raw_text does not have it isolated.
              // In a real app we'd map srt_payload to UI logic. For now, since transcript only gives us raw_text, we just use index * 5 for a mock timestamp progression,
              // or just keep it simple. If we want exact time matching, we'd need structured transcript data.
              const mockTime = index * 10;
              const isActive = currentTime >= mockTime && currentTime < mockTime + 10;
              
              // Parse speaker dynamically safely
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
                className={`transcript-line group flex gap-6 cursor-pointer ${isActive ? 'bg-primary/5 -mx-6 px-6 py-2 border-l-2 border-primary' : ''}`}
                onClick={() => setCurrentTime(mockTime)}
              >
                <span className={`timestamp text-[10px] font-mono font-bold w-16 flex-shrink-0 ${isActive ? 'text-primary' : 'text-primary opacity-40 transition-opacity'}`}>
                  {formatTimecode(mockTime, false)}
                </span>
                <div className="flex-1">
                  <p className={`text-[13px] leading-relaxed ${isActive ? 'text-white' : 'text-slate-400'} ${isItalic ? 'italic' : ''}`}>
                    {speaker && <span className={`${isActive ? 'text-primary font-bold' : 'text-white font-semibold'}`}>{speaker}: </span>}
                    {content}
                  </p>
                  {isActive && (
                    <div className="mt-2 flex gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Key Dialogue</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">High Confidence</span>
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
    </div>
  );
};
