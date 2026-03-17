import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useReview } from '../../contexts/ReviewContext';
import { createReviewNote } from '../../api/reviews';
import { TechnicalMetadata } from './TechnicalMetadata';
import { ReviewNotesList } from './ReviewNotesList';
import { formatTimecode } from '../../utils/timeFormat';

export const NotesSidebar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { clearDrawing, setActiveTool, inputRef, notes, loadNotes, currentTime, shapes, error, setError, loadAsset } = useReview();
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (id) {
      loadNotes(id);
      loadAsset(id);
    }
  }, [id, loadNotes, loadAsset]);

  const handleSubmitNote = async () => {
    if (!noteText.trim() || !id) return;
    
    try {
      setError(null);
      await createReviewNote(
        id,
        'Current User', // Mock author for MVP
        currentTime,
        noteText,
        shapes.length > 0 ? shapes : null
      );
      
      setNoteText('');
      clearDrawing();
      setActiveTool('pointer');
      await loadNotes(id); // Refresh list
    } catch (err) {
      console.error("Failed to save note:", err);
      setError("Failed to save review note. Please try again.");
    }
  };

  return (
    <aside data-testid="notes-sidebar" className="w-[30%] border-l border-white/5 bg-surface flex flex-col">
      <section className="flex-1 flex flex-col overflow-hidden">
        <ReviewNotesList notes={notes} error={error} />
        
        <div className="p-4 bg-black/40 border-t border-white/5">
          <div className="relative">
            <textarea
              ref={inputRef}
              className="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none h-16"
              placeholder={`Add note at ${formatTimecode(currentTime)}...`}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitNote();
                }
              }}
            ></textarea>
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <button
                onClick={handleSubmitNote}
                className="bg-primary hover:bg-primary/90 text-white p-1 rounded transition-colors"
              >
                <Send size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <div className="h-[25%] border-t border-white/5 bg-black/20 overflow-y-auto">
        <TechnicalMetadata />
      </div>
    </aside>
  );
};
