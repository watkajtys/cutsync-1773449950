import React, { useRef, useEffect } from 'react';
import { useReview } from '../contexts/ReviewContext';

export const useCanvasDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const shapesRef = useRef(useReview().shapes);
  const currentShapeRef = useRef(useReview().currentShape);

  const {
    activeTool, activeColor, shapes, currentShape,
    setShapes, setCurrentShape, videoRef, saveShapesToBackend
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
      const scale = Math.min(rect.width / video.videoWidth, rect.height / video.videoHeight);
      const renderedWidth = video.videoWidth * scale;
      const renderedHeight = video.videoHeight * scale;
      
      const offsetX = (rect.width - renderedWidth) / 2;
      const offsetY = (rect.height - renderedHeight) / 2;
      
      return {
        x: (e.clientX - rect.left - offsetX) / renderedWidth,
        y: (e.clientY - rect.top - offsetY) / renderedHeight
      };
    }
    
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'pointer') return;
    
    isDrawing.current = true;
    const { x, y } = getCoordinates(e as React.PointerEvent<HTMLCanvasElement>);
    setCurrentShape({
      tool: activeTool,
      color: activeColor,
      points: [{ x, y }]
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || activeTool === 'pointer' || !currentShape) return;
    
    const { x, y } = getCoordinates(e as React.PointerEvent<HTMLCanvasElement>);
    
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

  const handlePointerUp = (e?: React.PointerEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || activeTool === 'pointer' || !currentShape) return;
    isDrawing.current = false;
    const newShapes = [...shapes, currentShape];
    setShapes(newShapes);
    setCurrentShape(null);
    saveShapesToBackend(newShapes);
  };

  // Dedicated effect just for the ResizeObserver to draw whenever the window size changes
  // We use refs so we don't need to rebuild the observer or trigger the effect every frame during drawing
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

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;

      const currentShapesState = shapesRef.current;
      const currentActiveShape = currentShapeRef.current;

      const allShapes = currentActiveShape ? [...currentShapesState, currentActiveShape] : currentShapesState;

      allShapes.forEach(shape => {
        ctx.strokeStyle = shape.color;
        ctx.fillStyle = shape.color;
        ctx.beginPath();
        
        if (shape.points.length === 0) return;

        let toX = (x: number) => x * canvas.width;
        let toY = (y: number) => y * canvas.height;

        const video = videoRef.current;
        if (video && video.videoWidth && video.videoHeight) {
          const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
          const renderedWidth = video.videoWidth * scale;
          const renderedHeight = video.videoHeight * scale;
          const offsetX = (canvas.width - renderedWidth) / 2;
          const offsetY = (canvas.height - renderedHeight) / 2;
          
          toX = (x: number) => (x * renderedWidth) + offsetX;
          toY = (y: number) => (y * renderedHeight) + offsetY;
        }

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

    const resizeObserver = new ResizeObserver(() => {
      drawFromRefs();
    });
    
    resizeObserver.observe(canvas);
    window.addEventListener('resize', drawFromRefs);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', drawFromRefs);
    };
  }, []); // Run observer setup once

  // Redraw whenever the shapes array or currentShape actually changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;

      const allShapes = currentShape ? [...shapes, currentShape] : shapes;

      allShapes.forEach(shape => {
        ctx.strokeStyle = shape.color;
        ctx.fillStyle = shape.color;
        ctx.beginPath();
        
        if (shape.points.length === 0) return;

        let toX = (x: number) => x * canvas.width;
        let toY = (y: number) => y * canvas.height;

        const video = videoRef.current;
        if (video && video.videoWidth && video.videoHeight) {
          const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
          const renderedWidth = video.videoWidth * scale;
          const renderedHeight = video.videoHeight * scale;
          const offsetX = (canvas.width - renderedWidth) / 2;
          const offsetY = (canvas.height - renderedHeight) / 2;
          
          toX = (x: number) => (x * renderedWidth) + offsetX;
          toY = (y: number) => (y * renderedHeight) + offsetY;
        }

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

    draw();
  }, [shapes, currentShape]);

  return {
    canvasRef,
    activeTool,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
