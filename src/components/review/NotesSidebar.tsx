import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useReview } from '../../contexts/ReviewContext';
import { createReviewNote } from '../../api/reviews';
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
      
      // Atomic lifecycle reset: synchronously clear drawing buffers and reset active tool
      // immediately upon successful backend submission.
      resetCanvas();
      setNoteText('');
      await loadNotes(assetId); // Refresh list
    } catch (err) {
      console.error("Failed to save note:", err);
      setError("Failed to save review note. Please try again.");
    }
  };

  return (
    <aside className="w-[30%] border-l border-white/5 bg-black/60 backdrop-blur-xl flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-20">
      <section className="flex-1 flex flex-col">
        <ReviewNotesList notes={notes} error={error} />
        
        <div className="p-6 bg-black/60 border-t border-white/10 flex flex-col gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
          <div className="relative">
            <textarea
              ref={inputRef}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] placeholder:text-slate-500 resize-none h-20 shadow-inner text-slate-200"
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
        </div>
      </section>
    </aside>
  );
};
