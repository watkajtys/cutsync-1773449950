import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PenTool, CheckCircle, ArrowUpRight } from 'lucide-react';
import { ReviewNote } from '../../types/review';
import { fetchReviewNotes, createReviewNote } from '../../hooks/useReviewNotes';

export const CollaborationDrawer: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [notes, setNotes] = useState<ReviewNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnected, setIsDisconnected] = useState(false);

  // Mock values until the player state is integrated in phase 4
  const mockCurrentTime = 725.11; // 00:12:05
  const mockAuthor = "Alex Rivers";

  useEffect(() => {
    const loadNotes = async () => {
      if (assetId) {
        setIsLoading(true);
        setIsDisconnected(false);
        try {
          const fetchedNotes = await fetchReviewNotes(assetId);
          setNotes(fetchedNotes);
        } catch (error) {
          setIsDisconnected(true);
        } finally {
          setIsLoading(false);
        }
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
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="h-12 flex items-center px-6 border-b border-white/5 shrink-0 bg-surface">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Collaboration & Review Drawer</span>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Active Comments ({notes.length})</h4>
            <button className="text-primary text-[10px] font-bold uppercase">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-xs text-slate-500">Loading comments...</span>
              </div>
            ) : isDisconnected ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-red-500 text-sm font-bold">Disconnected - Check PocketBase Port 8090</div>
              </div>
            ) : notes.length === 0 ? (
              <div className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-800 flex-shrink-0">
                  <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzKhWLSKnAzAauvIwjImoVPnPTt7-K2rcU455fWERDrWZcF8nPI2Q1G38CznoSOoZuwvZ6I01Vb789wHd_c9J01e6L5whT2ItHyaUQaMfx-izq9DyBNaPO5FPxnuh2UxkNcbRMVhQNRdKzrctpCwYbMvGqlOPrugw6B3N9Ot-OyWU131KF-43uxXfwexisEdIJhSoaUz9_ZY9Tw-5_EEBjWATiYcJlclLkKh40HR07xEi22LuZ4wJfpALdgSAPFdU2e0sOIHeZgbM"/>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200">Sarah J.</span>
                    <span className="text-[10px] font-mono text-primary font-bold">00:12:05</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">The atmospheric mist layer is slightly overpowering the highlights in the left quadrant.</p>
                </div>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{note.author.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-200">{note.author}</span>
                      <span className="text-[10px] font-mono text-primary font-bold">{formatTimecode(note.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{note.note_text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="p-6 flex flex-col bg-black/20 border-t border-white/5 shrink-0">
          <div className="mb-4">
            <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Quick Actions</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
              <PenTool className="text-slate-400 group-hover:text-primary w-6 h-6" strokeWidth={1.5} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Annotate</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
              <CheckCircle className="text-slate-400 group-hover:text-emerald-500 w-6 h-6" strokeWidth={1.5} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Approve</span>
            </button>
          </div>
          <div className="relative mt-auto">
            <div className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
              <textarea 
                className="w-full bg-transparent border-none p-4 pr-12 text-sm text-white focus:ring-0 placeholder:text-slate-500 resize-none outline-none block" 
                placeholder="Drop a note..." 
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
              ></textarea>
              <button 
                className="absolute bottom-3 right-3 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/90 hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100"
                onClick={handleAddNote}
                disabled={!newNoteText.trim()}
              >
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
