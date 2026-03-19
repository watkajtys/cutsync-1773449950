import React from 'react';
import { useReview } from '../../contexts/ReviewContext';

export const MarkupSidebar: React.FC = () => {
  const { resetCanvas, shapes } = useReview();

  return (
    <aside className="w-72 flex flex-col border-r border-white/5 bg-black/60 backdrop-blur-xl p-5 gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-20">
      <div className="flex-1 overflow-y-auto telemetry-panel bg-white/5 rounded-lg border border-white/10 p-4 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Markup History</h3>
          {shapes.length > 0 && (
            <button
              onClick={resetCanvas}
              className="text-[9px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[12px]">delete_sweep</span>
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2">
          {shapes.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-4">No shapes drawn.</p>
          )}
          {shapes.map((shape, index) => (
            <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 hover:border-primary/50 transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center bg-black/40 shadow-inner"
                  style={{ boxShadow: `0 0 10px ${shape.color}40` }}
                >
                  <span className="material-symbols-outlined text-[14px]" style={{ color: shape.color }}>
                    {shape.tool === 'freehand' ? 'gesture' : shape.tool === 'rect' ? 'rectangle' : shape.tool === 'arrow' ? 'north_east' : 'near_me'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-200 font-bold tracking-wide">Shape_{index + 1}</span>
              </div>
              <span className="material-symbols-outlined text-sm text-slate-500 group-hover:text-primary transition-colors">visibility</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
