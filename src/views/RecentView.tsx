import React from 'react';

export const RecentView: React.FC = () => {
  return (
    <>
      <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 shrink-0 bg-slate-950/50 backdrop-blur-md z-10">
        <h2 className="text-2xl font-semibold capitalize">Recent Assets</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="text-slate-500">Recent assets will appear here.</div>
      </div>
    </>
  );
};
