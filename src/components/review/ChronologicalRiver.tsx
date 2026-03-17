import React, { useMemo } from 'react';
import { useReview } from '../../contexts/ReviewContext';
import { formatTimecode } from '../../utils/timeFormat';

export const ChronologicalRiver: React.FC = () => {
  const { notes, currentTime, seekToTime, videoRef } = useReview();
  const duration = videoRef?.current?.duration || 100; // Mock duration fallback

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    seekToTime(percentage * duration);
  };

  const getPercentage = (time: number) => {
    return (time / duration) * 100;
  };

  // Mock tick marks for visual scaffolding
  const tickMarks = useMemo(() => Array.from({ length: 20 }, (_, i) => {
    const time = (duration / 20) * i;
    return {
      id: i,
      percentage: getPercentage(time),
      label: formatTimecode(time).substring(3, 8), // just show MM:SS
      isMajor: i % 5 === 0
    };
  }), [duration]);

  // Mock waveform heights for visual scaffolding
  const waveformBars = useMemo(() => Array.from({ length: 150 }, (_, i) => ({
    id: i,
    height: Math.random() * 60 + 10,
    opacity: Math.random() * 0.3 + 0.1
  })), []);

  return (
    <section className="h-32 border-t border-border-subtle bg-surface relative flex flex-col">
      <div className="h-6 flex items-center px-4 bg-black/40 border-b border-border-subtle justify-between shrink-0 z-20">
        <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Chronological River • Frame-by-Frame Navigation</h3>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold text-slate-600 uppercase">Zoom: 1:1</span>
          <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-slate-600 w-1/2 h-full"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-x-hidden custom-scrollbar relative">
        <div className="flex flex-col h-full w-full relative cursor-pointer group" onClick={handleTimelineClick}>
          
          {/* Timecode Tick Marks */}
          <div className="absolute top-0 left-4 right-4 h-6 border-b border-white/5 pointer-events-none z-10">
            {tickMarks.map((tick) => (
              <div 
                key={tick.id}
                className="absolute top-0 bottom-0 flex flex-col items-center"
                style={{ left: `${tick.percentage}%`, transform: 'translateX(-50%)' }}
              >
                <div className={`w-px bg-slate-600 ${tick.isMajor ? 'h-2' : 'h-1'}`}></div>
                {tick.isMajor && (
                  <span className="text-[8px] text-slate-500 font-mono mt-0.5 leading-none">{tick.label}</span>
                )}
              </div>
            ))}
          </div>

          {/* Center Line Scaffolding */}
          <div className="absolute top-1/2 left-4 right-4 h-px bg-white/5 -translate-y-1/2 pointer-events-none z-0"></div>

          {/* Muted Waveform Pattern Container */}
          <div className="absolute inset-0 left-4 right-4 flex items-center justify-between opacity-30 pointer-events-none z-0">
            {waveformBars.map((bar) => (
              <div 
                key={bar.id}
                className="w-[2px] bg-slate-600 rounded-full"
                style={{ 
                  height: `${bar.height}%`,
                  opacity: bar.opacity
                }}
              ></div>
            ))}
          </div>

          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 shadow-[0_0_15px_rgba(43,108,238,0.8)] transition-all duration-75"
            style={{ left: `calc(${getPercentage(currentTime)}% + 16px)` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45 -translate-y-1.5"></div>
          </div>
          
          <div className="flex w-full h-full items-center px-4 z-10">
            {/* Minimal structural representation */}
            <div className="w-full h-1 bg-white/10 rounded-full relative">
              <div 
                className="absolute top-0 bottom-0 left-0 bg-primary/30 rounded-l-full"
                style={{ width: `${getPercentage(currentTime)}%` }}
              ></div>
            </div>
            <span className="absolute bottom-1 right-2 text-[10px] font-mono text-white/80 font-bold z-20">
              {formatTimecode(currentTime)} <span className="text-slate-500 font-normal ml-1">({Math.floor(currentTime * 24)} frames)</span>
            </span>
          </div>
          
          {/* Note Indicators */}
          {notes.map((note) => (
            <div 
              key={note.id}
              onClick={(e) => { e.stopPropagation(); seekToTime(note.timestamp); }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full hover:scale-150 transition-transform cursor-pointer shadow-lg z-20"
              style={{ left: `calc(${getPercentage(note.timestamp)}% + 16px)` }}
              title={note.note_text}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};
