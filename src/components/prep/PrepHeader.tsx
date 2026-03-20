import React from 'react';
import { Database, Sparkles, Settings } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { usePrep } from '../../contexts/PrepContext';
import { exportTranscriptAsSRT, exportCutSuggestionsAsCSV, downloadBlob } from '../../utils/exportUtils';

export const PrepHeader: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const { transcripts, cutSuggestions } = usePrep();

  const handleExportSRT = () => {
    const srtContent = exportTranscriptAsSRT(transcripts || []);
    downloadBlob(srtContent, `transcript_${assetId}.srt`, 'text/plain');
  };

  const handleExportCSV = () => {
    const csvContent = exportCutSuggestionsAsCSV(cutSuggestions || []);
    downloadBlob(csvContent, `cut_suggestions_${assetId}.csv`, 'text/csv');
  };

  return (
    <header className="h-[60px] flex items-center justify-between px-6 border-b border-white/5 bg-[#111111] z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5 bg-[#A855F7]/10 px-3 py-1.5 rounded-lg border border-[#A855F7]/20">
          <div className="bg-[#A855F7] p-1 rounded flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.5)]">
            <Database className="text-white" size={14} />
          </div>
          <h2 className="text-white text-[13px] font-black tracking-tight uppercase">CutSync</h2>
          <span className="text-[10px] font-black uppercase text-[#A855F7] tracking-widest ml-1">Prep Mode</span>
        </div>
        
        <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest">
          <span className="text-slate-500 uppercase">Source</span>
          <span className="text-white uppercase font-bold">A004_C012_0412_RAW</span>
          <span className="text-slate-600 mx-2">/</span>
          <span className="text-slate-500 uppercase">Pocketbase</span>
          <span className="text-[#10b981] uppercase font-bold shadow-sm">Connected</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 bg-[#A855F7]/10 border border-[#A855F7]/20 rounded-full px-4 py-1.5 shadow-inner cursor-pointer hover:bg-[#A855F7]/20 transition-colors">
          <Sparkles className="text-[#A855F7]" size={14} />
          <span className="text-[10px] font-bold text-[#A855F7] uppercase tracking-widest">AI Analysis Active</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportSRT}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors border border-white/10"
          >
            Export SRT
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors border border-white/10"
          >
            Export CSV
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded border border-white/10 cursor-pointer transition-colors">
          <Settings size={14} />
          Source Config
        </div>

        <div className="h-8 w-8 rounded-full border-2 border-white/10 overflow-hidden bg-white/20 flex items-center justify-center relative cursor-pointer group">
           <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </header>
  );
};
