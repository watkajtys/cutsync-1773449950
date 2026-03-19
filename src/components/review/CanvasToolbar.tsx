import React from 'react';
import { useReview } from '../../contexts/ReviewContext';

export const CanvasToolbar: React.FC = () => {
  const { activeTool, setActiveTool, activeColor, setActiveColor, resetCanvas } = useReview();

  return (
    <div className="flex items-center gap-3 bg-black/40 px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveTool('pointer')}
          className={`p-1.5 rounded-lg transition-all ${
            activeTool === 'pointer' ? 'bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Pointer"
        >
          <span className="material-symbols-outlined text-[18px]">near_me</span>
        </button>
        <button
          onClick={() => setActiveTool('freehand')}
          className={`p-1.5 rounded-lg transition-all ${
            activeTool === 'freehand' ? 'bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Freehand"
        >
          <span className="material-symbols-outlined text-[18px]">gesture</span>
        </button>
        <button
          onClick={() => setActiveTool('rect')}
          className={`p-1.5 rounded-lg transition-all ${
            activeTool === 'rect' ? 'bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Rectangle"
        >
          <span className="material-symbols-outlined text-[18px]">rectangle</span>
        </button>
        <button
          onClick={() => setActiveTool('arrow')}
          className={`p-1.5 rounded-lg transition-all ${
            activeTool === 'arrow' ? 'bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Arrow"
        >
          <span className="material-symbols-outlined text-[18px]">north_east</span>
        </button>
      </div>
      
      <div className="w-px h-5 bg-white/10 mx-1"></div>
      
      <div className="flex items-center gap-1.5">
        {['#39FF14', '#ef4444', '#3b82f6', '#facc15', '#ffffff'].map(color => (
          <button
            key={color}
            onClick={() => setActiveColor(color)}
            className={`w-3.5 h-3.5 rounded-full transition-transform ${activeColor === color ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-black' : 'hover:scale-110'}`}
            style={{ backgroundColor: color }}
            title={`Color ${color}`}
          />
        ))}
      </div>
      
      <div className="w-px h-5 bg-white/10 mx-1"></div>
      
      <button
        onClick={resetCanvas}
        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center justify-center"
        title="Clear Canvas"
      >
        <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
      </button>
    </div>
  );
};
