import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchReviewNotes, createReviewNote, updateReviewNote, deleteReviewNote } from '../api/reviews';
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
  currentAssetId: string | null;
  loadAsset: (assetId: string) => Promise<void>;
  saveShapesToBackend: (newShapes: Shape[]) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTool = searchParams.get('tool') as Tool | null;
  const initialTool = urlTool && ['pointer', 'freehand', 'rect', 'arrow'].includes(urlTool) ? urlTool : 'pointer';

  const [activeTool, setActiveTool] = useState<Tool>(initialTool);
  const [activeColor, setActiveColor] = useState<string>('#ef4444');

  // Sync tool change back to URL query parameters
  useEffect(() => {
    const currentTool = searchParams.get('tool');
    if (activeTool === 'pointer' && currentTool !== null) {
      setSearchParams({}, { replace: true });
    } else if (activeTool !== 'pointer' && currentTool !== activeTool) {
      setSearchParams({ tool: activeTool }, { replace: true });
    }
  }, [activeTool, searchParams, setSearchParams]);

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [viewingNoteTime, setViewingNoteTime] = useState<number | null>(null);
  const [notes, setNotes] = useState<ReviewNote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [currentAssetId, setCurrentAssetId] = useState<string | null>(null);
  
  const pendingNoteIdRef = useRef<string | null>(null);
  const activeSavePromiseRef = useRef<Promise<void> | null>(null);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const clearDrawing = async () => {
    // If we're viewing a note with canvas data, clearing the canvas should clear the note's data too.
    if (viewingNoteTime !== null) {
      const noteToUpdate = notes.find(n => n.timestamp === viewingNoteTime);
      if (noteToUpdate && noteToUpdate.canvas_data) {
        if (noteToUpdate.note_text.trim() === '') {
          await deleteReviewNote(noteToUpdate.id);
          pendingNoteIdRef.current = null;
        } else {
          await updateReviewNote(noteToUpdate.id, null);
        }
        if (currentAssetId) await loadNotes(currentAssetId);
      }
    } else {
      // Look for a blank "draft" note at the exact same timestamp to clear
      const noteToUpdate = notes.find(n => Math.abs(currentTime - n.timestamp) < 0.2 && n.note_text.trim() === '');
      if (noteToUpdate) {
        await deleteReviewNote(noteToUpdate.id);
        pendingNoteIdRef.current = null;
        if (currentAssetId) await loadNotes(currentAssetId);
      }
    }
    setShapes([]);
    setCurrentShape(null);
    setViewingNoteTime(null);
  };

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
      setCurrentAssetId(assetId);
      if (assetId === ':id') {
        console.warn(`Intercepted generic route parameter "${assetId}". Aborting fetch.`);
        setNotes([]);
        setError('ASSET_NOT_FOUND');
        return;
      }
      const fetchedNotes = await fetchReviewNotes(assetId);
      setNotes(fetchedNotes);
      
      // If we seek to a new time or load notes, make sure we clear our pending ID tracking
      // unless we specifically need it, but normally on load we reset it.
    } catch (err: any) {
      console.error("Failed to fetch notes in context", err);
      if (err?.status === 404 || err?.message?.includes('404')) {
        setError('ASSET_NOT_FOUND');
      } else {
        setError("Unable to sync note at this time.");
      }
    }
  }, []);

  const saveShapesToBackend = useCallback((newShapes: Shape[]): Promise<void> => {
    if (!currentAssetId) return Promise.resolve();

    const task = async () => {
      try {
        // Auto-save: either update the current note or create a blank "draft" note holding the drawing
        let matchedNote = notes.find(n => n.timestamp === viewingNoteTime);
        if (!matchedNote) {
          matchedNote = notes.find(n => Math.abs(currentTime - n.timestamp) < 0.2);
        }
        
        // If we have a pending ID that we just created, prioritize that to avoid race conditions
        const targetId = matchedNote?.id || pendingNoteIdRef.current;
        
        if (targetId) {
          await updateReviewNote(targetId, newShapes.length > 0 ? newShapes : null);
        } else if (newShapes.length > 0) {
          const newNote = await createReviewNote(currentAssetId, 'Current User', currentTime, '', newShapes);
          pendingNoteIdRef.current = newNote.id;
        }
        await loadNotes(currentAssetId);
      } catch (err) {
        console.error("Failed to save shapes:", err);
      }
    };

    const newPromise = (activeSavePromiseRef.current || Promise.resolve())
      .then(task)
      .finally(() => {
        if (activeSavePromiseRef.current === newPromise) {
          activeSavePromiseRef.current = null;
        }
      });
    
    activeSavePromiseRef.current = newPromise;
    return activeSavePromiseRef.current;
  }, [currentAssetId, notes, viewingNoteTime, currentTime, loadNotes]);

  const loadAsset = useCallback(async (assetId: string) => {
    try {
      setCurrentAssetId(assetId);
      if (assetId === ':id') {
        console.warn(`Intercepted generic route parameter "${assetId}". Aborting asset fetch.`);
        setAssetUrl(null);
        setError('ASSET_NOT_FOUND');
        return;
      }
      console.log(`[PocketBase Fetch] Fetching asset with ID: ${assetId} from url: ${pb.baseUrl}/api/collections/assets/records/${assetId}`);
      const assetRecord = await pb.collection('assets').getOne(assetId, { requestKey: null });
      if (assetRecord && assetRecord.file) {
        const fileUrl = pb.files.getUrl(assetRecord, assetRecord.file);
        console.log(`[PocketBase Fetch] Asset resolved. Media URL: ${fileUrl}`);
        setAssetUrl(fileUrl);
      }
    } catch (err: any) {
      console.error(`[PocketBase Fetch] Failed to fetch asset ${assetId} for review:`, err);
      if (err?.status === 404 || err?.message?.includes('404')) {
        setError('ASSET_NOT_FOUND');
      }
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
      currentAssetId,
      loadAsset,
      saveShapesToBackend
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
