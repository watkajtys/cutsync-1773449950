import React, { useRef, useEffect } from 'react';
import { Play, FastForward, Rewind, SkipBack, SkipForward, Volume2, Subtitles, Settings, Maximize } from 'lucide-react';
import { useReview } from '../../contexts/ReviewContext';
import { DrawingToolbar } from './DrawingToolbar';

export const TheaterPlayer: React.FC = () => {
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
      // For rect and arrow, just update the second point
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

    // Set internal canvas resolution to match its display size exactly
    const rect = canvas.getBoundingClientRect();
    // Only resize if the display size changed to avoid clearing the canvas unnecessarily
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
        
        // Draw main line
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Draw arrowhead
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

  return (
    <section className="flex-1 bg-black flex flex-col relative group">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="video-container w-full max-w-6xl relative bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-white/5" style={{ aspectRatio: '21 / 9' }}>
          <img alt="Silent Horizon Review" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg"/>
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full z-10 touch-none ${activeTool !== 'pointer' ? 'cursor-crosshair' : 'cursor-default'}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerOut={handlePointerUp}
          />
          <DrawingToolbar />
          <div className="absolute top-4 left-4 pointer-events-none z-20">
            <div className="flex items-center gap-3">
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-sm font-bold animate-pulse">REC</span>
              <span className="text-[11px] font-mono text-white/60 tracking-tighter">SCENE 04 | TAKE 02 | V03</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-right pointer-events-none z-20">
            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Resolution</p>
            <p className="text-xs font-bold text-white/80">4K DCI (4096 x 1716)</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-20">
            <div className="h-full bg-primary w-[34%] relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-16 bg-surface-accent border-t border-border-subtle flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Rewind size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
            <Play className="fill-current" size={20} />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <FastForward size={20} />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Volume2 className="text-slate-500" size={18} />
            <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="bg-primary w-2/3 h-full"></div>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-border-subtle"></div>
          <div className="flex items-center gap-4">
            <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
              <Subtitles size={18} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
              <Settings size={18} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
