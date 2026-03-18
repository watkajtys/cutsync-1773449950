import React from 'react';
import { useReview } from '../../contexts/ReviewContext';

export const MarkupSidebar: React.FC = () => {
  const { resetCanvas, shapes } = useReview();

  return (
    <aside className="w-72 flex flex-col border-r border-white/5 bg-panel-dark p-5 gap-6">
      <div className="flex-1 overflow-y-auto telemetry-panel bg-white/5 rounded-lg border border-white/10 p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">Markup History</h3>
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

      <div className="bg-white/5 rounded-lg border border-white/10 p-4 space-y-4">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Lifecycle & Versioning</h3>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-bold uppercase tracking-wider transition-colors">
              Snapshot
            </button>
            <button className="flex-1 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-bold uppercase tracking-wider transition-colors">
              Insert
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded text-[9px] font-bold uppercase tracking-wider transition-colors">
              Commit V4
            </button>
          </div>
        </div>
        <button
          onClick={resetCanvas}
          className="w-full py-2 flex items-center justify-center gap-2 rounded bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all font-bold text-[10px] uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-sm">delete_sweep</span>
          Clear Canvas
        </button>
      </div>
    </aside>
  );
};
