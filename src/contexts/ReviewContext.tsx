import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchReviewNotes } from '../api/reviews';
import { ReviewNote, Shape, Tool } from '../types/review';

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
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  notes: ReviewNote[];
  loadNotes: (assetId: string) => Promise<void>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTool, setActiveTool] = useState<Tool>('pointer');
  const [activeColor, setActiveColor] = useState<string>('#ef4444');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [notes, setNotes] = useState<ReviewNote[]>([]);
  const [error, setError] = useState<string | null>(null);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const clearDrawing = () => {
    setShapes([]);
    setCurrentShape(null);
  };

  const seekToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
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
      currentTime,
      setCurrentTime,
      notes,
      loadNotes,
      error,
      setError
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
