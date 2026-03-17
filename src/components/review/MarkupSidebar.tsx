import React from 'react';
import { useReview } from '../../contexts/ReviewContext';

export const MarkupSidebar: React.FC = () => {
  const { activeTool, setActiveTool, activeColor, setActiveColor, clearDrawing, shapes } = useReview();

  const colors = [
    '#39FF14', // markup-green
    '#ef4444', // red-500
    '#3b82f6', // blue-500
    '#facc15', // yellow-400
    '#ffffff'  // white
  ];

  return (
    <aside className="w-72 flex flex-col border-r border-white/5 bg-panel-dark">
      <div className="p-5 border-b border-white/5">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-5">Markup Toolkit</h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => setActiveTool('freehand')}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all ${
              activeTool === 'freehand'
                ? 'bg-primary text-white ring-1 ring-primary/50 shadow-lg shadow-primary/20'
                : 'bg-slate-800/40 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-white/5'
            }`}
          >
            <span className="material-symbols-outlined">gesture</span>
            <span className="text-[9px] font-bold uppercase">Freehand</span>
          </button>
          <button
            onClick={() => setActiveTool('rect')}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all ${
              activeTool === 'rect'
                ? 'bg-primary text-white ring-1 ring-primary/50 shadow-lg shadow-primary/20'
                : 'bg-slate-800/40 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-white/5'
            }`}
          >
            <span className="material-symbols-outlined">rectangle</span>
            <span className="text-[9px] font-bold uppercase">Box</span>
          </button>
          <button
            onClick={() => setActiveTool('arrow')}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all ${
              activeTool === 'arrow'
                ? 'bg-primary text-white ring-1 ring-primary/50 shadow-lg shadow-primary/20'
                : 'bg-slate-800/40 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-white/5'
            }`}
          >
            <span className="material-symbols-outlined">north_east</span>
            <span className="text-[9px] font-bold uppercase">Arrow</span>
          </button>
          <button
            onClick={() => setActiveTool('pointer')}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all ${
              activeTool === 'pointer'
                ? 'bg-primary text-white ring-1 ring-primary/50 shadow-lg shadow-primary/20'
                : 'bg-slate-800/40 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-white/5'
            }`}
          >
            <span className="material-symbols-outlined">near_me</span>
            <span className="text-[9px] font-bold uppercase">Pointer</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Color Palette</label>
              <span className="text-[9px] font-mono text-markup-green" style={{ color: activeColor }}>
                {activeColor.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setActiveColor(color)}
                  className={`size-6 rounded-full transition-transform ${
                    activeColor === color
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-panel-dark'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stroke Weight</label>
              <span className="text-[10px] font-mono text-slate-100">2PX</span>
            </div>
            <div className="px-1">
              <div className="relative h-1 bg-slate-800 rounded-full flex items-center">
                <div className="absolute inset-y-0 left-0 w-1/4 bg-primary rounded-full"></div>
                <div className="absolute left-1/4 size-3 bg-white rounded-full shadow-xl cursor-pointer"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Snap to Grid</span>
            <button className="w-8 h-4 bg-primary rounded-full relative">
              <div className="absolute right-0.5 top-0.5 size-3 bg-white rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto telemetry-panel p-5">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4">Markup History</h3>
        <div className="space-y-2">
          {shapes.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-4">No shapes drawn.</p>
          )}
          {shapes.map((shape, index) => (
            <div key={index} className="p-3 bg-white/5 rounded border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-sm" style={{ color: shape.color }}>
                  {shape.tool === 'freehand' ? 'gesture' : shape.tool === 'rect' ? 'rectangle' : shape.tool === 'arrow' ? 'north_east' : 'near_me'}
                </span>
                <span className="text-xs text-slate-300 font-medium">Shape_{index + 1}</span>
              </div>
              <span className="material-symbols-outlined text-sm text-slate-500 group-hover:text-slate-200">visibility</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={clearDrawing}
          className="w-full py-2 flex items-center justify-center gap-2 rounded bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all font-bold text-[10px] uppercase tracking-widest clear-canvas-btn"
        >
          <span className="material-symbols-outlined text-sm">delete_sweep</span>
          Clear Canvas
        </button>
      </div>
    </aside>
  );
};
