import React, { useEffect, useState } from 'react';
import { Eye, Paperclip, Send } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { ReviewNote } from '../../types/review';
import { fetchReviewNotes, createReviewNote } from '../../hooks/useReviewNotes';

export const NotesSidebar: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [notes, setNotes] = useState<ReviewNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock values until the player state is integrated in phase 4
  const mockCurrentTime = 842.11; 
  const mockAuthor = "Alex Rivers";

  useEffect(() => {
    const loadNotes = async () => {
      if (assetId) {
        setIsLoading(true);
        const fetchedNotes = await fetchReviewNotes(assetId);
        setNotes(fetchedNotes);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    loadNotes();
  }, [assetId]);

  const handleAddNote = async () => {
    if (!newNoteText.trim() || !assetId) return;
    
    const newNote = await createReviewNote(
      assetId,
      mockAuthor,
      mockCurrentTime,
      newNoteText
    );
    
    if (newNote) {
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setNewNoteText('');
    }
  };

  const formatTimecode = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * 24); // Assuming 24fps
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  };

  return (
    <aside className="w-[400px] border-l border-border-subtle bg-surface flex flex-col">
      <div className="flex border-b border-border-subtle">
        <button className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-primary border-b-2 border-primary">
          Comments
        </button>
        <button className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
          History
        </button>
        <button className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
          Metadata
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-xs text-slate-500">Loading comments...</span>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-xs text-slate-500">No comments yet.</span>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full overflow-hidden border border-border-subtle flex-shrink-0 bg-slate-800 flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{note.author.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">{note.author}</span>
                    <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 bg-primary/10 rounded">
                      {formatTimecode(note.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-2">{note.note_text}</p>
                  <div className="flex items-center gap-4">
                    <button className="text-[10px] font-bold text-slate-500 hover:text-primary uppercase tracking-wider">Reply</button>
                    <button className="text-[10px] font-bold text-slate-500 hover:text-emerald-400 uppercase tracking-wider">Resolve</button>
                  </div>
                </div>
              </div>
              <div className="h-[1px] bg-border-subtle"></div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-border-subtle bg-surface-accent">
        <div className="relative">
          <textarea 
            className="w-full bg-surface border border-border-subtle rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none" 
            placeholder={`Add a comment at ${formatTimecode(mockCurrentTime)}...`} 
            rows={3}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddNote();
              }
            }}
          ></textarea>
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button className="text-slate-500 hover:text-slate-300">
              <Paperclip size={18} />
            </button>
            <button 
              className="bg-primary hover:bg-primary/90 text-white p-1.5 rounded-md transition-all disabled:opacity-50"
              onClick={handleAddNote}
              disabled={!newNoteText.trim()}
            >
              <Send className="fill-current" size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
