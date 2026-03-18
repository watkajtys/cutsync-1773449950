import React from 'react';
import { useReview } from '../../contexts/ReviewContext';

export const CanvasToolbar: React.FC = () => {
  const { activeTool, setActiveTool, activeColor, setActiveColor, resetCanvas } = useReview();

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 z-30 flex flex-col gap-3 shadow-2xl">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setActiveTool('pointer')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'pointer' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">near_me</span>
        </button>
        <button
          onClick={() => setActiveTool('freehand')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'freehand' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">gesture</span>
        </button>
        <button
          onClick={() => setActiveTool('rect')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'rect' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">rectangle</span>
        </button>
        <button
          onClick={() => setActiveTool('arrow')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'arrow' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">north_east</span>
        </button>
      </div>
      
      <div className="w-full h-px bg-white/10 my-1"></div>
      
      <div className="flex flex-col gap-2 items-center pb-1">
        {['#39FF14', '#ef4444', '#3b82f6', '#facc15', '#ffffff'].map(color => (
          <button
            key={color}
            onClick={() => setActiveColor(color)}
            className={`w-4 h-4 rounded-full transition-transform ${activeColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-110'}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      
      <div className="w-full h-px bg-white/10 my-1"></div>
      
      <button
        onClick={resetCanvas}
        className="p-2 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center justify-center"
        title="Clear Canvas"
      >
        <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
      </button>
    </div>
  );
};
