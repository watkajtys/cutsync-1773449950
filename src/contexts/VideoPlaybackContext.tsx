import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchReviewNotes } from '../api/reviews';
import { ReviewNote } from '../types/review';
import { pb } from '../lib/pocketbase';

interface VideoPlaybackContextType {
  videoRef: React.RefObject<HTMLVideoElement>;
  seekToTime: (time: number) => void;
  seekToNote: (note: ReviewNote) => void;
  currentTime: number;
  setCurrentTime: (time: number, programmatic?: boolean) => void;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  viewingNoteTime: number | null;
  setViewingNoteTime: React.Dispatch<React.SetStateAction<number | null>>;
  notes: ReviewNote[];
  loadNotes: (assetId: string) => Promise<void>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  assetUrl: string | null;
  loadAsset: (assetId: string) => Promise<void>;
}

const VideoPlaybackContext = createContext<VideoPlaybackContextType | undefined>(undefined);

export const VideoPlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTime, setCurrentTimeState] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [viewingNoteTime, setViewingNoteTime] = useState<number | null>(null);
  const [notes, setNotes] = useState<ReviewNote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [assetUrl, setAssetUrl] = useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  const setCurrentTime = (time: number, programmatic: boolean = true) => {
    setCurrentTimeState(time);
    if (programmatic && videoRef.current) {
      if (Math.abs(videoRef.current.currentTime - time) > 0.1) {
        videoRef.current.currentTime = time;
        // Dispatch native timeupdate event to trigger any internal listeners
        videoRef.current.dispatchEvent(new Event('timeupdate'));
      }
    }
  };

  const seekToTime = (time: number) => {
    setCurrentTime(time, true);
  };

  const seekToNote = (note: ReviewNote) => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = note.timestamp;
      setCurrentTime(note.timestamp);
      setViewingNoteTime(note.timestamp);
      // We'll update shapes separately in ReviewContext if needed, 
      // but VideoPlaybackContext shouldn't know about shapes directly.
      // Actually, since ReviewContext combines them, we should emit an event or let AnnotationContext handle it, 
      // but we can just use an event listener to decouple it.
      // Wait, let's keep it simple: the caller of seekToNote in ReviewNotesList can also call setShapes.
      // Or we can just leave it to ReviewContext.
      videoRef.current.dispatchEvent(new CustomEvent('seekToNote', { detail: note }));
      videoRef.current.dispatchEvent(new Event('timeupdate'));
    }
  };

  const loadNotes = useCallback(async (assetId: string) => {
    try {
      setError(null);
      const fetchedNotes = await fetchReviewNotes(assetId);
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Failed to fetch notes in context", err);
      setError("Failed to load review notes. Please check your connection.");
    }
  }, []);

  const loadAsset = useCallback(async (assetId: string) => {
    try {
      if (!assetId) return;
      const assetRecord = await pb.collection('assets').getOne(assetId, { requestKey: null });
      if (assetRecord && assetRecord.file) {
        setAssetUrl(pb.files.getUrl(assetRecord, assetRecord.file));
      } else {
        setAssetUrl(null);
      }
    } catch (err) {
      console.error("Failed to fetch asset for review:", err);
      setAssetUrl(null);
    }
  }, []);

  return (
    <VideoPlaybackContext.Provider value={{
      videoRef,
      seekToTime,
      seekToNote,
      currentTime,
      setCurrentTime,
      duration,
      setDuration,
      viewingNoteTime,
      setViewingNoteTime,
      notes,
      loadNotes,
      error,
      setError,
      assetUrl,
      loadAsset
    }}>
      {children}
    </VideoPlaybackContext.Provider>
  );
};

export const useVideoPlayback = () => {
  const context = useContext(VideoPlaybackContext);
  if (!context) throw new Error('useVideoPlayback must be used within VideoPlaybackProvider');
  return context;
};
