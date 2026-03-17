import React from 'react';
import { ListFilter, AlertCircle } from 'lucide-react';
import { ReviewNote } from '../../types/review';
import { formatTimecode } from '../../utils/timeFormat';
import { formatTimeAgo } from '../../utils/dateUtils';
import { useParams } from 'react-router-dom';
import { useReview } from '../../contexts/ReviewContext';

interface ReviewNotesListProps {
  notes: ReviewNote[];
  error: string | null;
}

export const ReviewNotesList: React.FC<ReviewNotesListProps> = ({ notes, error }) => {
  const { id } = useParams<{ id: string }>();
  const { seekToNote, loadNotes } = useReview();

  return (
    <>
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Review Notes ({notes.length})</h3>
        <div className="flex gap-2">
          <button className="text-slate-500 hover:text-white transition-colors">
            <ListFilter size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {error && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <AlertCircle size={12} className="text-slate-500" />
            <p className="text-[10px] text-slate-500 italic">Unable to sync note at this time.</p>
            {id && (
              <button 
                onClick={() => loadNotes(id)}
                className="text-[10px] font-medium text-slate-400 hover:text-white transition-colors ml-auto"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {notes.map(note => (
          <div 
            key={note.id}
            onClick={() => seekToNote(note)} 
            className="group relative bg-white/5 p-3 rounded-lg border border-white/5 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 rounded bg-primary/10">{formatTimecode(note.timestamp)}</span>
              <span className="text-[9px] text-slate-500 font-bold">{note.created ? formatTimeAgo(note.created) : ''}</span>
            </div>
            <p className={`text-xs text-slate-300 leading-relaxed ${note.canvas_data ? 'italic border-l-2 border-primary/30 pl-2' : ''}`}>
              {note.canvas_data ? `"${note.note_text}"` : note.note_text}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                {note.author === 'Sarah J.' ? (
                  <img alt="Sarah" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzKhWLSKnAzAauvIwjImoVPnPTt7-K2rcU455fWERDrWZcF8nPI2Q1G38CznoSOoZuwvZ6I01Vb789wHd_c9J01e6L5whT2ItHyaUQaMfx-izq9DyBNaPO5FPxnuh2UxkNcbRMVhQNRdKzrctpCwYbMvGqlOPrugw6B3N9Ot-OyWU131KF-43uxXfwexisEdIJhSoaUz9_ZY9Tw-5_EEBjWATiYcJlclLkKh40HR07xEi22LuZ4wJfpALdgSAPFdU2e0sOIHeZgbM"/>
                ) : (
                  <span className="text-[8px] text-white">{note.author.substring(0,2).toUpperCase()}</span>
                )}
              </div>
              <span className="text-[10px] font-medium text-slate-400">{note.author}</span>
            </div>
          </div>
        ))}

        {!error && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-6 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-3xl opacity-50">edit_note</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">No notes added yet</p>
              <p className="text-xs text-slate-500">Play the video and start typing below to add a timestamped note, or use the drawing tools to annotate a specific frame.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
