import React from 'react';
import { Play, SkipForward, SkipBack, Volume2, Settings } from 'lucide-react';
import { useVideoPlayback } from '../../contexts/VideoPlaybackContext';
import { formatTimecode } from '../../utils/timeFormat';

export const PrepPlaybackControls: React.FC = () => {
  const { videoRef, currentTime, duration, setCurrentTime } = useVideoPlayback();

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      setCurrentTime(newTime, true);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-6 relative bg-gradient-to-t from-black/80 to-transparent">
      {/* Timeline Scrubber */}
      <div className="absolute top-0 left-0 w-full transform -translate-y-1/2 px-6">
        <div 
          className="relative w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer hover:h-2 transition-all group"
          onClick={handleTimelineClick}
        >
          <div
            className="absolute inset-y-0 left-0 bg-[#A855F7] rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(168,85,247,0.6)]"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          {/* Mock In/Out Points for Visual Polish */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[20%] w-[2px] h-3 bg-[#10b981] rounded-full"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-[80%] w-[2px] h-3 bg-[#10b981] rounded-full"></div>
        </div>
      </div>

      <div className="flex items-center justify-between h-full pt-1">
        {/* Left Controls */}
        <div className="flex items-center gap-6 w-[200px]">
          <button className="text-white/60 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <button 
            className="w-12 h-10 rounded-xl bg-[#A855F7] flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:bg-[#b56ef5] transition-colors"
            onClick={handlePlayPause}
          >
            <Play className="text-white ml-1" size={20} fill="currentColor" />
          </button>
          <button className="text-white/60 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Center Info */}
        <div className="flex-1 flex items-center justify-center gap-2 font-mono text-sm">
          <span className="text-white font-bold tracking-widest">{formatTimecode(currentTime, false)}</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-sans ml-1">[CURRENT TC]</span>
        </div>

        {/* Right Info */}
        <div className="flex items-center justify-end gap-6 w-[350px]">
          <div className="flex flex-col text-[10px] font-mono tracking-widest text-slate-500">
            <div><span className="text-slate-600 mr-2">IN:</span>00:14:00:00</div>
            <div><span className="text-slate-600 mr-2">OUT:</span>00:14:45:12</div>
          </div>
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          <div className="flex items-center gap-4 text-white/60">
            <Volume2 className="hover:text-white transition-colors cursor-pointer" size={18} />
            <Settings className="hover:text-white transition-colors cursor-pointer" size={18} />
          </div>
          <div className="text-[9px] font-mono tracking-widest text-slate-600 text-right uppercase">
            <div>23.976 FPS</div>
            <div>4K RAW</div>
          </div>
        </div>
      </div>
    </div>
  );
};
