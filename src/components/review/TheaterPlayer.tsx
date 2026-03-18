import React, { useEffect, useState, useRef } from 'react';
import { useCanvasDrawing } from '../../hooks/useCanvasDrawing';
import { useReview } from '../../contexts/ReviewContext';
import { CanvasToolbar } from './CanvasToolbar';
import { CoordinateOverlay } from './CoordinateOverlay';
import { TimelineScrubber } from './TimelineScrubber';
import { PlaybackControls } from './PlaybackControls';

export const TheaterPlayer: React.FC = () => {
  const { 
    videoRef, inputRef, setCurrentTime, assetUrl, clearDrawing, 
    viewingNoteTime, setViewingNoteTime, notes, setShapes, currentShape 
  } = useReview();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const lastScrubTime = useRef<number | null>(null);

  const {
    canvasRef,
    activeTool
  } = useCanvasDrawing();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [videoRef, inputRef, isPlaying, clearDrawing]);

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
          
          <CanvasToolbar />

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
          
          <CoordinateOverlay />

          <TimelineScrubber 
            duration={duration} 
            className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-20"
          />
        </div>
      </div>
      <div className="flex flex-col bg-surface-accent border-t border-border-subtle">
        {/* Full-width Timeline Container */}
        <div data-testid="timeline-container">
          <TimelineScrubber 
            duration={duration}
            className="w-full h-12 flex items-center bg-black/20 px-4 border-b border-white/5"
            renderTrack={(percent) => (
              <>
                <div className="absolute top-2 bottom-2 left-4 right-4 pointer-events-none flex justify-between">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className={`w-px bg-white/10 ${i % 5 === 0 ? 'h-full' : 'h-1/2 mt-auto mb-auto'}`} />
                  ))}
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                  <div 
                    className="h-full bg-primary relative pointer-events-none" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg z-20 pointer-events-none"
                  style={{ left: `calc(1rem + ${percent}% - 8px)` }}
                />
              </>
            )}
          />
        </div>

        <PlaybackControls 
          isPlaying={isPlaying} 
          duration={duration} 
          togglePlay={togglePlay} 
        />
      </div>
    </section>
  );
};
