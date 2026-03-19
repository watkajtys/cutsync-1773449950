import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchReviewNotes } from '../api/reviews';
import { ReviewNote } from '../types/review';
import { pb } from '../lib/pocketbase';
import { useAnnotation } from './AnnotationContext';

interface VideoPlaybackContextType {
  videoRef: React.RefObject<HTMLVideoElement>;
  seekToTime: (time: number) => void;
  seekToNote: (note: ReviewNote) => void;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
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
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [viewingNoteTime, setViewingNoteTime] = useState<number | null>(null);
  const [notes, setNotes] = useState<ReviewNote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [assetUrl, setAssetUrl] = useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { setShapes } = useAnnotation();

  const seekToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      videoRef.current.dispatchEvent(new Event('timeupdate'));
    }
  };

  const seekToNote = (note: ReviewNote) => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = note.timestamp;
      setCurrentTime(note.timestamp);
      setViewingNoteTime(note.timestamp);
      setShapes(note.canvas_data || []);
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
      const assetRecord = await pb.collection('assets').getOne(assetId, { requestKey: null });
      if (assetRecord && assetRecord.file) {
        setAssetUrl(pb.files.getUrl(assetRecord, assetRecord.file));
      }
    } catch (err) {
      console.error("Failed to fetch asset for review:", err);
    }
  }, []);

  return (
    <VideoPlaybackContext.Provider value={{
      videoRef,
      seekToTime,
      seekToNote,
      currentTime,
      setCurrentTime,
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
