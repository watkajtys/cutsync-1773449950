import React, { useState, useEffect } from 'react';
import { Info, ListFilter, Send, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useReview } from '../../contexts/ReviewContext';
import { createReviewNote } from '../../api/reviews';

const formatTimecode = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const f = Math.floor((seconds % 1) * 24); // Assuming 24fps
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
};

const formatTimeAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
};

export const NotesSidebar: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const { clearDrawing, setActiveTool, inputRef, seekToTime, notes, loadNotes, currentTime, shapes, error, setError } = useReview();
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (assetId) {
      loadNotes(assetId);
    }
  }, [assetId, loadNotes]);

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
      clearDrawing();
      setActiveTool('pointer');
      await loadNotes(assetId); // Refresh list
    } catch (err) {
      console.error("Failed to save note:", err);
      setError("Failed to save review note. Please try again.");
    }
  };

  return (
    <aside className="w-[30%] border-l border-white/5 bg-surface flex flex-col">
      <section className="h-[45%] flex flex-col border-b border-white/5">
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Technical Metadata</h3>
          <Info className="text-slate-500" size={14} strokeWidth={1.5} />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">File Info</span>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Codec</span>
                <span className="text-white font-mono">Apple ProRes 4444 XQ</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Resolution</span>
                <span className="text-white font-mono">4096 x 1716</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Frame Rate</span>
                <span className="text-white font-mono">23.976 fps</span>
              </div>
            </div>
          </div>
          
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Color Space</span>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Gamma</span>
                <span className="text-white font-mono">LogC4</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Gamut</span>
                <span className="text-white font-mono">ARRI Wide Gamut 4</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="p-3 bg-white/5 rounded border border-white/5">
              <span className="text-[9px] font-bold text-emerald-500 uppercase block mb-1">Status</span>
              <p className="text-[11px] text-slate-300">Awaiting Final VFX Compositing for shots 024-031</p>
            </div>
          </div>
        </div>
      </section>

      <section className="h-[55%] flex flex-col">
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
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-start gap-2 mb-2">
              <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" strokeWidth={2} />
              <p className="text-xs text-red-300 leading-relaxed">{error}</p>
            </div>
          )}

          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => seekToTime(note.timestamp)} 
              className="group relative bg-white/5 p-3 rounded-lg border border-white/5 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 rounded bg-primary/10">{formatTimecode(note.timestamp)}</span>
                <span className="text-[9px] text-slate-500 font-bold">{formatTimeAgo(note.created)}</span>
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

          {notes.length === 0 && (
            <div className="text-center p-4">
              <p className="text-xs text-slate-500">No notes added yet.</p>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-black/40 border-t border-white/5">
          <div className="relative">
            <textarea
              ref={inputRef}
              className="w-full bg-surface border border-white/10 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none h-16"
              placeholder="Add note at 00:14:02:11..."
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
    </aside>
  );
};
