import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Pause, FastForward, Rewind, SkipBack, SkipForward, Volume2, Subtitles, Settings, Maximize } from 'lucide-react';
import { useCanvasDrawing } from '../../hooks/useCanvasDrawing';
import { useReview } from '../../contexts/ReviewContext';
import { formatTimecode } from '../../utils/timeFormat';

export const TheaterPlayer: React.FC = () => {
  const { videoRef, inputRef, currentTime, setCurrentTime, seekToTime, assetUrl, clearDrawing, viewingNoteTime, setViewingNoteTime, notes, setShapes, currentShape, setActiveTool, activeColor, setActiveColor, resetCanvas, shapes } = useReview();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scrubTime, setScrubTime] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lastScrubTime = useRef<number | null>(null);

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
            clearDrawing();
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
        clearDrawing();
      }
      setIsPlaying(!isPlaying);
    }
  };

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const t = videoRef.current.currentTime;
      setCurrentTime(t);
      
      const prevTime = lastScrubTime.current ?? t;
      const isManualScrub = Math.abs(t - prevTime) > 0.5;
      lastScrubTime.current = t;

      if (!isPlaying) {
        // Find if there's a note at this exact timestamp (within 0.2s)
        const matchedNote = notes.find(n => Math.abs(t - n.timestamp) < 0.2 && n.canvas_data && n.canvas_data.length > 0);
        
        if (matchedNote) {
          if (viewingNoteTime !== matchedNote.timestamp) {
            setViewingNoteTime(matchedNote.timestamp);
            setShapes(matchedNote.canvas_data!);
          }
        } else {
          // No matched note. If we were viewing one, or if user manually scrubbed, clear it.
          // Don't clear if they are actively drawing (currentShape).
          if ((viewingNoteTime !== null || isManualScrub) && !currentShape) {
            clearDrawing();
            setViewingNoteTime(null);
          }
        }
      }
    }
  };

  return (
    <section className="flex-1 bg-black flex flex-col relative group">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="video-container w-full max-w-6xl relative bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-white/5" style={{ aspectRatio: '21 / 9' }}>
          
          {/* Floating Toolbar */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 z-30 flex flex-col gap-3 shadow-2xl">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTool('pointer')}
                className={`p-2 rounded-xl transition-all ${
                  activeTool === 'pointer' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">near_me</span>
              </button>
              <button
                onClick={() => setActiveTool('freehand')}
                className={`p-2 rounded-xl transition-all ${
                  activeTool === 'freehand' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">gesture</span>
              </button>
              <button
                onClick={() => setActiveTool('rect')}
                className={`p-2 rounded-xl transition-all ${
                  activeTool === 'rect' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">rectangle</span>
              </button>
              <button
                onClick={() => setActiveTool('arrow')}
                className={`p-2 rounded-xl transition-all ${
                  activeTool === 'arrow' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">north_east</span>
              </button>
            </div>
            
            <div className="w-full h-px bg-white/10 my-1"></div>
            
            <div className="flex flex-col gap-2 items-center pb-1">
              {['#39FF14', '#ef4444', '#3b82f6', '#facc15', '#ffffff'].map(color => (
                <button
                  key={color}
                  onClick={() => setActiveColor(color)}
                  className={`w-4 h-4 rounded-full transition-transform ${activeColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            <div className="w-full h-px bg-white/10 my-1"></div>
            
            <button
              onClick={resetCanvas}
              className="p-2 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center justify-center"
              title="Clear Canvas"
            >
              <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
            </button>
          </div>

          <video 
            ref={videoRef}
            src={assetUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"}
            className="w-full h-full object-contain opacity-80"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onDurationChange={(e) => setDuration(e.currentTarget.duration)}
            onPlay={() => {
              setIsPlaying(true);
              clearDrawing();
            }}
            onPause={() => setIsPlaying(false)}
            crossOrigin="anonymous"
          />
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full z-10 touch-none ${activeTool && activeTool !== 'pointer' ? 'cursor-crosshair' : 'cursor-default'} ${isPlaying ? 'hidden' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerOut={handlePointerUp}
          />
          <div className="absolute top-4 left-4 pointer-events-none z-20">
            <div className="flex items-center gap-3">
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-sm font-bold animate-pulse">REC</span>
              <span className="text-[11px] font-mono text-white/60 tracking-tighter">SCENE 04 | TAKE 02 | V03</span>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 text-right pointer-events-none z-20 bg-black/50 p-2 rounded backdrop-blur-sm border border-white/10">
            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Resolution</p>
            <p className="text-xs font-bold text-white/80 font-mono">4K DCI (4096 x 1716)</p>
          </div>
          
          {/* Dynamic Coordinate Overlays */}
          {shapes.map((s, i) => {
             const x = s.points[0]?.x;
             const y = s.points[0]?.y;
             if (x === undefined || y === undefined) return null;
             return (
               <div 
                 key={i} 
                 className="absolute pointer-events-none z-30 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono text-white/70 border border-white/10"
                 style={{ left: `${x * 100}%`, top: `calc(${y * 100}% - 20px)` }}
               >
                 X: {x.toFixed(2)} Y: {y.toFixed(2)}
               </div>
             );
          })}
          {currentShape && currentShape.points.length > 0 && (
            <div 
              className="absolute pointer-events-none z-30 bg-primary/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono text-primary border border-primary/30"
              style={{ left: `${currentShape.points[0].x * 100}%`, top: `calc(${currentShape.points[0].y * 100}% - 20px)` }}
            >
              X: {currentShape.points[0].x.toFixed(2)} Y: {currentShape.points[0].y.toFixed(2)}
            </div>
          )}

          <div 
            ref={timelineRef}
            className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-20 cursor-pointer touch-none"
            onPointerDown={handlePointerDownTimeline}
            onPointerMove={handlePointerMoveTimeline}
            onPointerUp={handlePointerUpTimeline}
            onPointerCancel={handlePointerUpTimeline}
          >
            <div className="h-full bg-primary relative" style={{ width: `${duration > 0 ? ((scrubTime !== null ? scrubTime : currentTime) / duration) * 100 : 0}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-surface-accent border-t border-border-subtle">
        {/* Full-width Timeline Container */}
        <div 
          ref={timelineRef}
          data-testid="timeline-container"
          className="w-full h-12 relative cursor-pointer touch-none flex items-center bg-black/20 px-4 border-b border-white/5"
          onPointerDown={handlePointerDownTimeline}
          onPointerMove={handlePointerMoveTimeline}
          onPointerUp={handlePointerUpTimeline}
          onPointerCancel={handlePointerUpTimeline}
        >
          {/* Tick Marks Layer */}
          <div className="absolute top-2 bottom-2 left-4 right-4 pointer-events-none flex justify-between">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className={`w-px bg-white/10 ${i % 5 === 0 ? 'h-full' : 'h-1/2 mt-auto mb-auto'}`} />
            ))}
          </div>
          
          {/* Track Background */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
            {/* Progress Bar */}
            <div 
              className="h-full bg-primary relative pointer-events-none" 
              style={{ width: `${duration > 0 ? ((scrubTime !== null ? scrubTime : currentTime) / duration) * 100 : 0}%` }}
            />
          </div>
          
          {/* Scrubber Knob */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg z-20 pointer-events-none"
            style={{ left: `calc(1rem + ${duration > 0 ? ((scrubTime !== null ? scrubTime : currentTime) / duration) * 100 : 0}% - 8px)` }}
          />
        </div>

        {/* Playback Controls Row */}
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
      </div>
    </section>
  );
};
