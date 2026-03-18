import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useReview } from '../../contexts/ReviewContext';
import { createReviewNote } from '../../api/reviews';
import { TechnicalMetadata } from './TechnicalMetadata';
import { ReviewNotesList } from './ReviewNotesList';
import { formatTimecode } from '../../utils/timeFormat';

export const NotesSidebar: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const { resetCanvas, inputRef, notes, loadNotes, currentTime, shapes, error, setError, loadAsset } = useReview();
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (assetId) {
      loadNotes(assetId);
      loadAsset(assetId);
    }
  }, [assetId, loadNotes, loadAsset]);

  const handleSubmitNote = async () => {
    if (!noteText.trim() || !assetId) return;
    
    try {
      setError(null);
      await createReviewNote(
        assetId,
        'Current User', // Mock author for MVP
        currentTime,
        noteText,
        shapes.length > 0 ? shapes : null
      );
      
      setNoteText('');
      resetCanvas();
      await loadNotes(assetId); // Refresh list
    } catch (err) {
      console.error("Failed to save note:", err);
      setError("Failed to save review note. Please try again.");
    }
  };

  return (
    <aside className="w-[30%] border-l border-white/5 bg-surface flex flex-col">
      <TechnicalMetadata />

      <section className="h-[55%] flex flex-col">
        <ReviewNotesList notes={notes} error={error} />
        
        <div className="p-6 bg-black/40 border-t border-white/5 flex flex-col gap-4">
          <div className="relative">
            <textarea
              ref={inputRef}
              className="w-full bg-surface border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none h-20 shadow-inner"
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
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={handleSubmitNote}
                className="bg-primary hover:bg-primary/90 text-white p-1.5 rounded-md transition-colors shadow-lg"
              >
                <Send size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Render & Cache</span>
              <span className="text-primary">100%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary/80 w-full rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};
