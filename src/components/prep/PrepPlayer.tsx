import React, { useEffect } from 'react';
import { Play, SkipForward, Volume2 } from 'lucide-react';
import { usePrep } from '../../contexts/PrepContext';
import { formatTimecode } from '../../utils/timeFormat';

export const PrepPlayer: React.FC = () => {
  const { videoRef, setCurrentTime, setDuration, currentTime, duration } = usePrep();

  const handleTimeUpdate = () => {
    if (videoRef.current) {
        // Only update state if it is significantly different to avoid excessive re-renders
        if (Math.abs(currentTime - videoRef.current.currentTime) > 0.5) {
            setCurrentTime(videoRef.current.currentTime, false);
        }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      setCurrentTime(newTime, true);
    }
  };

  return (
    <section className="h-[50%] min-h-[400px] flex flex-col bg-black relative border-b border-white/5">
      <div className="flex-1 flex items-center justify-center p-6 h-full">
        <div className="aspect-video h-full relative bg-neutral-900 shadow-2xl ring-1 ring-white/10 overflow-hidden group">
          <video
            ref={videoRef}
            src="/dummy.mp4"
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            controls={false}
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <div 
              className="relative w-full h-1 bg-white/20 rounded-full mb-4 cursor-pointer"
              onClick={handleTimelineClick}
            >
              <div
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Play className="text-white cursor-pointer" size={24} fill="currentColor" onClick={() => videoRef.current?.play()} />
                <SkipForward className="text-white/70 cursor-pointer" size={24} />
                <Volume2 className="text-white/70 cursor-pointer" size={20} />
              </div>
              <div className="text-[11px] font-mono text-white/80 tracking-widest">
                {formatTimecode(currentTime)} / {formatTimecode(duration)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
