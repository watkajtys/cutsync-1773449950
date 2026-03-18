import React from 'react';
import { useReview } from '../../contexts/ReviewContext';

export const CoordinateOverlay: React.FC = () => {
  const { shapes, currentShape } = useReview();

  return (
    <>
      {shapes.map((s, i) => {
         const x = s.points[0]?.x;
         const y = s.points[0]?.y;
         if (x === undefined || y === undefined) return null;
         return (
           <div 
             key={i} 
             className="absolute pointer-events-none z-30 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono text-white/70 border border-white/10"
             style={{ left: `${x * 100}%`, top: `calc(${y * 100}% - 20px)` }}
           >
             X: {x.toFixed(2)} Y: {y.toFixed(2)}
           </div>
         );
      })}
      {currentShape && currentShape.points.length > 0 && (
        <div 
          className="absolute pointer-events-none z-30 bg-primary/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono text-primary border border-primary/30"
          style={{ left: `${currentShape.points[0].x * 100}%`, top: `calc(${currentShape.points[0].y * 100}% - 20px)` }}
        >
          X: {currentShape.points[0].x.toFixed(2)} Y: {currentShape.points[0].y.toFixed(2)}
        </div>
      )}
    </>
  );
};
