import React, { useEffect, useState } from 'react';
import { PenTool, CheckCircle, Send } from 'lucide-react';
import { useParams } from 'react-router-dom';
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
    <div className="absolute bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-3xl border-t border-white/10 transform translate-y-[calc(100%-48px)] hover:translate-y-0 transition-transform duration-500 ease-in-out z-40">
      <div className="h-12 flex items-center justify-center cursor-pointer border-b border-white/5 relative">
        <div className="w-12 h-1 bg-white/20 rounded-full absolute top-2"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Collaboration & Review Drawer</span>
      </div>
      
      <div className="h-64 flex divide-x divide-white/5">
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
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
              <div className="flex justify-center items-center h-full">
                <span className="text-xs text-slate-500">No comments yet.</span>
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
        
        <div className="w-1/3 p-6 flex flex-col bg-black/20">
          <div className="mb-4">
            <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Quick Actions</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
              <PenTool className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" strokeWidth={1.5} />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Annotate</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
              <CheckCircle className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" strokeWidth={1.5} />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Approve</span>
            </button>
          </div>
          
          <div className="relative mt-auto">
            <textarea 
              className="w-full bg-surface border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none text-white" 
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
              className="absolute bottom-2 right-2 bg-primary text-white p-1.5 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              onClick={handleAddNote}
              disabled={!newNoteText.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
