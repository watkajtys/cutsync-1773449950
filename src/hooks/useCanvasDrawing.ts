import React, { useRef, useEffect } from 'react';
import { useReview } from '../contexts/ReviewContext';
import { getNormalizedCoordinates, getVideoRenderedDimensions } from '../utils/videoCoordinates';
import { Shape } from '../types/review';

export const useCanvasDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const shapesRef = useRef(useReview().shapes);
  const currentShapeRef = useRef(useReview().currentShape);

  const {
    activeTool, activeColor, shapes, currentShape,
    setShapes, setCurrentShape, videoRef
  } = useReview();

  useEffect(() => {
    shapesRef.current = shapes;
    currentShapeRef.current = currentShape;
  }, [shapes, currentShape]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
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

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeTool === 'pointer') return;
    
    isDrawing.current = true;
    const { x, y } = getCoordinates(e);
    setCurrentShape({
      tool: activeTool,
      color: activeColor,
      points: [{ x, y }]
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || activeTool === 'pointer' || !currentShape) return;
    
    const { x, y } = getCoordinates(e);
    
    if (activeTool === 'freehand') {
      setCurrentShape({
        ...currentShape,
        points: [...currentShape.points, { x, y }]
      });
    } else {
      setCurrentShape({
        ...currentShape,
        points: [currentShape.points[0], { x, y }]
      });
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing.current || activeTool === 'pointer' || !currentShape) return;
    isDrawing.current = false;
    setShapes([...shapes, currentShape]);
    setCurrentShape(null);
  };

  const renderShapes = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    allShapes: Shape[],
    video: HTMLVideoElement | null
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;

    // Pre-calculate rendering dimensions once per frame instead of per coordinate
    let renderedWidth = canvas.width;
    let renderedHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (video && video.videoWidth && video.videoHeight) {
      const dimensions = getVideoRenderedDimensions(
        canvas.width,
        canvas.height,
        video.videoWidth,
        video.videoHeight
      );
      renderedWidth = dimensions.renderedWidth;
      renderedHeight = dimensions.renderedHeight;
      offsetX = dimensions.offsetX;
      offsetY = dimensions.offsetY;
    }

    const toX = (x: number) => (x * renderedWidth) + offsetX;
    const toY = (y: number) => (y * renderedHeight) + offsetY;

    allShapes.forEach(shape => {
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.color;
      ctx.beginPath();
      
      if (shape.points.length === 0) return;

      if (shape.tool === 'freehand') {
        ctx.moveTo(toX(shape.points[0].x), toY(shape.points[0].y));
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(toX(shape.points[i].x), toY(shape.points[i].y));
        }
        ctx.stroke();
      } else if (shape.tool === 'rect') {
        if (shape.points.length < 2) return;
        const p1 = shape.points[0];
        const p2 = shape.points[1];
        ctx.strokeRect(toX(p1.x), toY(p1.y), toX(p2.x) - toX(p1.x), toY(p2.y) - toY(p1.y));
      } else if (shape.tool === 'arrow') {
        if (shape.points.length < 2) return;
        const p1 = shape.points[0];
        const p2 = shape.points[1];
        
        ctx.moveTo(toX(p1.x), toY(p1.y));
        ctx.lineTo(toX(p2.x), toY(p2.y));
        ctx.stroke();

        const angle = Math.atan2(toY(p2.y) - toY(p1.y), toX(p2.x) - toX(p1.x));
        const headlen = 15;
        ctx.beginPath();
        ctx.moveTo(toX(p2.x), toY(p2.y));
        ctx.lineTo(toX(p2.x) - headlen * Math.cos(angle - Math.PI / 6), toY(p2.y) - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX(p2.x) - headlen * Math.cos(angle + Math.PI / 6), toY(p2.y) - headlen * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(toX(p2.x), toY(p2.y));
        ctx.fill();
      }
    });
  };

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
    activeTool,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
