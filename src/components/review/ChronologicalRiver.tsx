import React from 'react';
import { useReview } from '../../contexts/ReviewContext';

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

  return (
    <section className="h-32 border-t border-border-subtle bg-surface relative">
      <div className="h-6 flex items-center px-4 bg-black/40 border-b border-border-subtle justify-between">
        <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Chronological River • Frame-by-Frame Navigation</h3>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold text-slate-600 uppercase">Zoom: 1:1</span>
          <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-slate-600 w-1/2 h-full"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 h-[calc(100%-24px)] flex overflow-x-hidden custom-scrollbar relative">
        <div className="flex items-center h-full w-full px-4 gap-1.5 relative cursor-pointer" onClick={handleTimelineClick}>
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 shadow-[0_0_15px_rgba(43,108,238,0.8)] transition-all duration-75"
            style={{ left: `calc(${getPercentage(currentTime)}% + 16px)` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45 -translate-y-1.5"></div>
          </div>
          
          <div className="flex w-full h-full items-center">
            {/* Minimal structural representation since we don't have real thumbnails */}
            <div className="w-full h-1 bg-white/10 rounded-full relative">
              <div 
                className="absolute top-0 bottom-0 left-0 bg-primary/30 rounded-l-full"
                style={{ width: `${getPercentage(currentTime)}%` }}
              ></div>
            </div>
            <span className="absolute bottom-1 right-2 text-[8px] font-mono text-white/80 font-bold">CURRENT: {Math.floor(currentTime * 24)}</span>
          </div>
          
          {/* Note Indicators */}
          {notes.map((note) => (
            <div 
              key={note.id}
              onClick={(e) => { e.stopPropagation(); seekToTime(note.timestamp); }}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full hover:scale-150 transition-transform cursor-pointer shadow-lg z-10"
              style={{ left: `calc(${getPercentage(note.timestamp)}% + 16px)` }}
              title={note.note_text}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};
