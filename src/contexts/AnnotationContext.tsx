import React, { createContext, useContext, useState, useCallback } from 'react';
import { Shape, Tool } from '../types/review';
import { useURLState } from '../hooks/useURLState';

interface AnnotationContextType {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  currentShape: Shape | null;
  setCurrentShape: React.Dispatch<React.SetStateAction<Shape | null>>;
  clearDrawing: () => void;
  resetCanvas: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

const AnnotationContext = createContext<AnnotationContextType | undefined>(undefined);

export const AnnotationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeToolRaw, setActiveTool] = useURLState<string>('tool', 'pointer');
  const activeTool = (activeToolRaw === 'freehand' || activeToolRaw === 'rect' || activeToolRaw === 'arrow' || activeToolRaw === 'pointer') 
    ? (activeToolRaw as Tool) 
    : 'pointer';

  const [activeColor, setActiveColor] = useState<string>('#ef4444');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const clearDrawing = useCallback(() => {
    setShapes([]);
    setCurrentShape(null);
  }, []);

  const resetCanvas = useCallback(() => {
    setShapes([]);
    setCurrentShape(null);
    setActiveTool('pointer');
  }, [setActiveTool]);

  return (
    <AnnotationContext.Provider value={{
      activeTool, setActiveTool,
      activeColor, setActiveColor,
      shapes, setShapes,
      currentShape, setCurrentShape,
      clearDrawing,
      resetCanvas,
      inputRef
    }}>
      {children}
    </AnnotationContext.Provider>
  );
};

export const useAnnotation = () => {
  const context = useContext(AnnotationContext);
  if (!context) throw new Error('useAnnotation must be used within AnnotationProvider');
  return context;
};
