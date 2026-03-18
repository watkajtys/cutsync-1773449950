import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchReviewNotes } from '../api/reviews';
import { ReviewNote, Shape, Tool } from '../types/review';
import { pb } from '../lib/pocketbase';

interface ReviewContextType {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  currentShape: Shape | null;
  setCurrentShape: React.Dispatch<React.SetStateAction<Shape | null>>;
  clearDrawing: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
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
  resetCanvas: () => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

import { useURLState } from '../hooks/useURLState';

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeToolRaw, setActiveTool] = useURLState<string>('tool', 'pointer');
  const activeTool = (activeToolRaw === 'freehand' || activeToolRaw === 'rect' || activeToolRaw === 'arrow' || activeToolRaw === 'pointer') 
    ? (activeToolRaw as Tool) 
    : 'pointer';

  const [activeColor, setActiveColor] = useState<string>('#ef4444');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [viewingNoteTime, setViewingNoteTime] = useState<number | null>(null);
  const [notes, setNotes] = useState<ReviewNote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [assetUrl, setAssetUrl] = useState<string | null>(null);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const clearDrawing = useCallback(() => {
    setShapes([]);
    setCurrentShape(null);
  }, []);

  const resetCanvas = useCallback(() => {
    setShapes([]);
    setCurrentShape(null);
    setActiveTool('pointer');
  }, [setActiveTool]);

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
    <ReviewContext.Provider value={{
      activeTool, setActiveTool,
      activeColor, setActiveColor,
      shapes, setShapes,
      currentShape, setCurrentShape,
      clearDrawing,
      inputRef,
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
      loadAsset,
      resetCanvas
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) throw new Error('useReview must be used within ReviewProvider');
  return context;
};
