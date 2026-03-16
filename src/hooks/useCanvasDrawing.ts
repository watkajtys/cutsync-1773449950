import React, { useRef, useEffect } from 'react';
import { useReview } from '../contexts/ReviewContext';

export const useCanvasDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const {
    activeTool, activeColor, shapes, currentShape,
    setShapes, setCurrentShape
  } = useReview();

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
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

      if (shape.tool === 'freehand') {
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
      } else if (shape.tool === 'rect') {
        if (shape.points.length < 2) return;
        const p1 = shape.points[0];
        const p2 = shape.points[1];
        ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
      } else if (shape.tool === 'arrow') {
        if (shape.points.length < 2) return;
        const p1 = shape.points[0];
        const p2 = shape.points[1];
        
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const headlen = 15;
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p2.x - headlen * Math.cos(angle - Math.PI / 6), p2.y - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(p2.x - headlen * Math.cos(angle + Math.PI / 6), p2.y - headlen * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(p2.x, p2.y);
        ctx.fill();
      }
    });
  }, [shapes, currentShape]);

  return {
    canvasRef,
    activeTool,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
