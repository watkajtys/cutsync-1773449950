import { useRef, useEffect } from 'react';
import { useReview } from '../contexts/ReviewContext';
import { getNormalizedCoordinates } from '../utils/videoCoordinates';
import { renderShapes } from '../utils/canvasRenderer';

export const useCanvasDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const {
    activeTool, activeColor, shapes, currentShape,
    setShapes, setCurrentShape, videoRef, inputRef
  } = useReview();

  const shapesRef = useRef(shapes);
  const currentShapeRef = useRef(currentShape);
  const activeToolRef = useRef(activeTool);
  const activeColorRef = useRef(activeColor);

  useEffect(() => {
    shapesRef.current = shapes;
    currentShapeRef.current = currentShape;
    activeToolRef.current = activeTool;
    activeColorRef.current = activeColor;
  }, [shapes, currentShape, activeTool, activeColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCoordinates = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const video = videoRef.current;
      
      if (video && video.videoWidth && video.videoHeight) {
        return getNormalizedCoordinates(e.clientX, e.clientY, rect, video.videoWidth, video.videoHeight);
      }
      
      // Fallback if video isn't loaded
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      };
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (activeToolRef.current === 'pointer') return;
      
      isDrawing.current = true;
      const { x, y } = getCoordinates(e);
      setCurrentShape({
        tool: activeToolRef.current,
        color: activeColorRef.current,
        points: [{ x, y }]
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDrawing.current || activeToolRef.current === 'pointer' || !currentShapeRef.current) return;
      
      const { x, y } = getCoordinates(e);
      const currShape = currentShapeRef.current;
      
      if (activeToolRef.current === 'freehand') {
        setCurrentShape({
          ...currShape,
          points: [...currShape.points, { x, y }]
        });
      } else {
        setCurrentShape({
          ...currShape,
          points: [currShape.points[0], { x, y }]
        });
      }
    };

    const handlePointerUp = () => {
      if (!isDrawing.current || activeToolRef.current === 'pointer' || !currentShapeRef.current) return;
      isDrawing.current = false;
      setShapes([...shapesRef.current, currentShapeRef.current]);
      setCurrentShape(null);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('pointerout', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('pointerout', handlePointerUp);
      
      // Explicitly clear and reset canvas context on unmount to prevent ghost drawing buffers
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      canvas.width = 0;
      canvas.height = 0;
    };
  }, [setShapes, setCurrentShape, videoRef]);

  // ResizeObserver to draw whenever the window size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawFromRefs = () => {
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const currentShapesState = shapesRef.current;
      const currentActiveShape = currentShapeRef.current;
      const allShapes = currentActiveShape ? [...currentShapesState, currentActiveShape] : currentShapesState;

      renderShapes(ctx, canvas, allShapes, videoRef.current);
    };

    const resizeObserver = new ResizeObserver(() => {
      drawFromRefs();
    });
    
    resizeObserver.observe(canvas);
    window.addEventListener('resize', drawFromRefs);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', drawFromRefs);
    };
  }, [videoRef]);

  // Redraw whenever the shapes array or currentShape actually changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const allShapes = currentShape ? [...shapes, currentShape] : shapes;
    renderShapes(ctx, canvas, allShapes, videoRef.current);
  }, [shapes, currentShape, videoRef]);

  return {
    canvasRef,
    activeTool
  };
};
