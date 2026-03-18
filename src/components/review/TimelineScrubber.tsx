import React, { useRef, useState, useCallback } from 'react';
import { useReview } from '../../contexts/ReviewContext';

interface TimelineScrubberProps {
  duration: number;
  className?: string;
  renderTrack?: (percent: number) => React.ReactNode;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({ duration, className = '', renderTrack }) => {
  const { currentTime, seekToTime } = useReview();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrubTime, setScrubTime] = useState<number | null>(null);

  const getScrubTime = useCallback((clientX: number) => {
    if (!timelineRef.current || duration <= 0) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return percent * duration;
  }, [duration]);

  const handlePointerDownTimeline = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const newTime = getScrubTime(e.clientX);
    setScrubTime(newTime);
    if (timelineRef.current) {
      timelineRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMoveTimeline = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newTime = getScrubTime(e.clientX);
      setScrubTime(newTime);
    }
  };

  const handlePointerUpTimeline = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      if (scrubTime !== null) {
        seekToTime(scrubTime);
      }
      setScrubTime(null);
      if (timelineRef.current) {
        timelineRef.current.releasePointerCapture(e.pointerId);
      }
    }
  };

  const currentScrubOrTime = scrubTime !== null ? scrubTime : currentTime;
  const percent = duration > 0 ? (currentScrubOrTime / duration) * 100 : 0;

  return (
    <div 
      ref={timelineRef}
      className={`relative cursor-pointer touch-none ${className}`}
      onPointerDown={handlePointerDownTimeline}
      onPointerMove={handlePointerMoveTimeline}
      onPointerUp={handlePointerUpTimeline}
      onPointerCancel={handlePointerUpTimeline}
    >
      {renderTrack ? renderTrack(percent) : (
        <div className="h-full bg-primary relative pointer-events-none" style={{ width: `${percent}%` }}>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg translate-x-1/2 pointer-events-none" />
        </div>
      )}
    </div>
  );
};
