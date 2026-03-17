import React from 'react';
import { MousePointer2, Pen, Square, ArrowUpRight, Trash2 } from 'lucide-react';
import { useReview } from '../../contexts/ReviewContext';

export const CanvasHUD: React.FC = () => {
  const { activeTool, setActiveTool, activeColor, setActiveColor, clearDrawing, shapes, currentShape } = useReview();

  const colors = [
    '#39FF14', // markup-green
    '#ef4444', // red-500
    '#3b82f6', // blue-500
    '#facc15', // yellow-400
    '#ffffff'  // white
  ];

  const hasShapes = shapes.length > 0 || currentShape !== null;

  return (
    <aside 
      data-testid="canvas-hud"
      className="absolute left-[24px] top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl"
    >
      <div className="flex flex-col gap-1 border-b border-white/10 pb-2 mb-1 relative">
        {hasShapes && (
          <button
            onClick={clearDrawing}
            className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/40 transition-colors clear-canvas-btn"
            title="Clear Canvas"
          >
            <Trash2 size={12} strokeWidth={2} />
          </button>
        )}
        <button
          onClick={() => setActiveTool('pointer')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${activeTool === 'pointer' ? 'text-[#3b82f6] bg-white/10' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
          title="Pointer"
        >
          <MousePointer2 size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => setActiveTool('freehand')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${activeTool === 'freehand' ? 'text-[#3b82f6] bg-white/10' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
          title="Freehand"
        >
          <Pen size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => setActiveTool('rect')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${activeTool === 'rect' ? 'text-[#3b82f6] bg-white/10' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
          title="Box"
        >
          <Square size={18} strokeWidth={2} />
        </button>
        <button
          onClick={() => setActiveTool('arrow')}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${activeTool === 'arrow' ? 'text-[#3b82f6] bg-white/10' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
          title="Arrow"
        >
          <ArrowUpRight size={18} strokeWidth={2} />
        </button>
      </div>
      
      <div className="flex flex-col gap-2 items-center py-1">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setActiveColor(color)}
            className={`w-4 h-4 rounded-full transition-transform ${
              activeColor === color
                ? 'ring-2 ring-white ring-offset-1 ring-offset-black scale-110'
                : 'hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </aside>
  );
};
