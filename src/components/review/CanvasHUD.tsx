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
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] flex gap-4">
      {/* Tool Properties Panel (Colors) */}
      {activeTool !== 'pointer' && (
        <aside className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-2xl h-12">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={`w-4 h-4 rounded-full transition-all ${
                activeColor === color
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                  : 'hover:scale-110 hover:shadow-[0_0_5px_rgba(255,255,255,0.3)]'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </aside>
      )}

      {/* Main Toolbar */}
      <aside 
        data-testid="canvas-hud"
        className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-2xl h-12 relative"
      >
        <button
          onClick={() => setActiveTool('pointer')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${activeTool === 'pointer' ? 'text-white bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          title="Pointer"
        >
          <MousePointer2 size={20} strokeWidth={2.5} className={activeTool === 'pointer' ? 'fill-white/20' : ''} />
        </button>
        <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
        <button
          onClick={() => setActiveTool('freehand')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${activeTool === 'freehand' ? 'text-white bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          title="Freehand"
        >
          <Pen size={20} strokeWidth={2.5} className={activeTool === 'freehand' ? 'fill-white/20' : ''} />
        </button>
        <button
          onClick={() => setActiveTool('rect')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${activeTool === 'rect' ? 'text-white bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          title="Box"
        >
          <Square size={20} strokeWidth={2.5} className={activeTool === 'rect' ? 'fill-white/20' : ''} />
        </button>
        <button
          onClick={() => setActiveTool('arrow')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${activeTool === 'arrow' ? 'text-white bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
          title="Arrow"
        >
          <ArrowUpRight size={20} strokeWidth={2.5} />
        </button>

        {hasShapes && (
          <>
            <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
            <button
              onClick={clearDrawing}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors clear-canvas-btn"
              title="Clear Canvas"
            >
              <Trash2 size={20} strokeWidth={2.5} />
            </button>
          </>
        )}
      </aside>
    </div>
  );
};
