import React, { useEffect, useState } from 'react';
import { Play, Pause, FastForward, Rewind, SkipBack, SkipForward, Volume2, Subtitles, Settings, Maximize } from 'lucide-react';
import { useCanvasDrawing } from '../../hooks/useCanvasDrawing';
import { DrawingToolbar } from './DrawingToolbar';
import { useReview } from '../../contexts/ReviewContext';

export const TheaterPlayer: React.FC = () => {
  const { videoRef, inputRef, setCurrentTime, assetUrl } = useReview();
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    canvasRef,
    activeTool,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useCanvasDrawing();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (videoRef.current) {
          if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          } else {
            videoRef.current.play();
            setIsPlaying(true);
          }
        }
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoRef, inputRef, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  return (
    <section className="w-[70%] bg-black flex flex-col relative group">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="video-container w-full max-w-6xl relative bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-white/5" style={{ aspectRatio: '21 / 9' }}>
          <video 
            ref={videoRef}
            src={assetUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"}
            className="w-full h-full object-cover opacity-80"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            crossOrigin="anonymous"
          />
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full z-10 touch-none ${activeTool !== 'pointer' ? 'cursor-crosshair' : 'cursor-default'}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerOut={handlePointerUp}
          />
          <DrawingToolbar />
          <div className="absolute top-4 left-4 pointer-events-none z-20">
            <div className="flex items-center gap-3">
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-sm font-bold animate-pulse">REC</span>
              <span className="text-[11px] font-mono text-white/60 tracking-tighter">SCENE 04 | TAKE 02 | V03</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-right pointer-events-none z-20">
            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Resolution</p>
            <p className="text-xs font-bold text-white/80">4K DCI (4096 x 1716)</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-20">
            <div className="h-full bg-primary w-[34%] relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-16 bg-surface-accent border-t border-border-subtle flex items-center justify-between px-8">
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
    </section>
  );
};
