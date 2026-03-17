import React from 'react';
import { AlignLeft, Search } from 'lucide-react';
import { usePrep } from '../../contexts/PrepContext';

export const SourceTranscript: React.FC = () => {
  const { transcripts, currentTime } = usePrep();

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
              
              return (
              <div key={transcript.id} className={`transcript-line group flex gap-6 ${isActive ? 'bg-primary/5 -mx-6 px-6 py-2 border-l-2 border-primary' : ''}`}>
                <span className={`timestamp text-[10px] font-mono font-bold w-16 flex-shrink-0 ${isActive ? 'text-primary' : 'text-primary opacity-40 transition-opacity'}`}>
                  {Math.floor(mockTime / 60).toString().padStart(2, '0')}:{Math.floor(mockTime % 60).toString().padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <p className={`text-[13px] leading-relaxed ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    <span className={`${isActive ? 'text-primary' : 'text-white'} font-semibold`}>AI:</span> {transcript.raw_text}
                  </p>
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
