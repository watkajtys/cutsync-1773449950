import React from 'react';
import { Play, Pause, FastForward, Rewind, SkipBack, SkipForward, Volume2, Subtitles, Settings, Maximize } from 'lucide-react';
import { useReview } from '../../contexts/ReviewContext';
import { formatTimecode } from '../../utils/timeFormat';

interface PlaybackControlsProps {
  isPlaying: boolean;
  duration: number;
  togglePlay: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ isPlaying, duration, togglePlay }) => {
  const { currentTime } = useReview();

  return (
    <div className="h-16 flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-white transition-colors">
          <SkipBack size={20} />
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <Rewind size={20} />
        </button>
        <button 
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause className="fill-current" size={20} /> : <Play className="fill-current" size={20} />}
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <FastForward size={20} />
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <SkipForward size={20} />
        </button>

        <div className="flex items-center gap-2 ml-4">
          <div className="font-mono text-xs font-bold text-white/80">
            {formatTimecode(currentTime)}
          </div>
          <span className="text-white/40 text-xs">/</span>
          <div className="font-mono text-xs font-bold text-white/40">
            {formatTimecode(duration)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Volume2 className="text-slate-500" size={18} />
          <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="bg-primary w-2/3 h-full"></div>
          </div>
        </div>
        <div className="h-6 w-[1px] bg-border-subtle"></div>
        <div className="flex items-center gap-4">
          <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
            <Subtitles size={18} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
            <Settings size={18} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
