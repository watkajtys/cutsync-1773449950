import React from 'react';
import { CloudCog, Users } from 'lucide-react';
import { ReviewHeader } from '../components/review/ReviewHeader';
import { TheaterPlayer } from '../components/review/TheaterPlayer';
import { NotesSidebar } from '../components/review/NotesSidebar';
import { MarkupSidebar } from '../components/review/MarkupSidebar';
import { ChronologicalRiver } from '../components/review/ChronologicalRiver';
import { ReviewProvider } from '../contexts/ReviewContext';

export const ReviewView: React.FC = () => {
  return (
    <ReviewProvider>
    <div className="text-slate-300 h-screen overflow-hidden flex flex-col bg-[#0c0e14] w-full">
      <ReviewHeader />
      <main className="flex-1 flex overflow-hidden">
        <MarkupSidebar />
        <TheaterPlayer />
        <NotesSidebar />
      </main>
      <ChronologicalRiver />
      <footer className="h-8 bg-black border-t border-border-subtle px-4 flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Review Session Active
          </div>
          <div className="flex items-center gap-2">
            <CloudCog size={12} />
            All Changes Synced
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Users size={12} />
            3 Active Reviewers
          </div>
          <div>Build v4.12.0-Production</div>
        </div>
      </footer>
    </div>
    </ReviewProvider>
  );
};
