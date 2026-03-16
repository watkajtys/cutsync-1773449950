import React from 'react';
import { useReview } from '../../contexts/ReviewContext';

export const DrawingToolbar: React.FC = () => {
  const { activeTool, setActiveTool, activeColor, setActiveColor } = useReview();

  const tools: { id: typeof activeTool, label: string }[] = [
    { id: 'pointer', label: 'Ptr' },
    { id: 'freehand', label: 'Pen' },
    { id: 'rect', label: 'Box' },
    { id: 'arrow', label: 'Arr' },
  ];

  const colors = ['#ef4444', '#eab308', '#2b6cee', '#22c55e'];

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col gap-4 bg-surface/80 backdrop-blur-md p-2 rounded-lg border border-white/10 z-30">
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors text-[10px] font-bold ${
              activeTool === tool.id ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <div className="w-full h-px bg-white/10"></div>
      <div className="flex flex-col gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setActiveColor(color)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
              activeColor === color ? 'ring-2 ring-white scale-110' : 'hover:scale-110'
            }`}
          >
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }}></div>
          </button>
        ))}
      </div>
    </div>
  );
};
