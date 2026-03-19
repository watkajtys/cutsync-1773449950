import { useRef, useCallback } from 'react';
import { ReviewNote, Shape } from '../types/review';

export const useNoteSync = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isPlaying: boolean,
  notes: ReviewNote[],
  viewingNoteTime: number | null,
  setViewingNoteTime: (time: number | null) => void,
  setShapes: (shapes: Shape[]) => void,
  clearDrawing: () => void,
  setCurrentTime: (time: number) => void,
  currentShape: Shape | null
) => {
  const lastScrubTime = useRef<number | null>(null);

  const handleTimeUpdate = useCallback(() => {
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
  }, [
    videoRef, isPlaying, notes, viewingNoteTime, 
    setViewingNoteTime, setShapes, clearDrawing, 
    setCurrentTime, currentShape
  ]);

  return handleTimeUpdate;
};
