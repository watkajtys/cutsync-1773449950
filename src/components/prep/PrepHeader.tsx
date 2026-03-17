import React from 'react';
import { Database, Sparkles, Download } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { usePrep } from '../../contexts/PrepContext';
import { exportTranscriptAsSRT, exportCutSuggestionsAsCSV, downloadBlob } from '../../utils/exportUtils';

export const PrepHeader: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const { transcripts, cutSuggestions } = usePrep();

  const handleExportSRT = () => {
    const srtContent = exportTranscriptAsSRT(transcripts);
    downloadBlob(srtContent, `transcript_${assetId}.srt`, 'text/plain');
  };

  const handleExportCSV = () => {
    const csvContent = exportCutSuggestionsAsCSV(cutSuggestions);
    downloadBlob(csvContent, `cut_suggestions_${assetId}.csv`, 'text/csv');
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-2xl z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary p-1 rounded-md flex items-center justify-center">
            <Database className="text-white" size={18} />
          </div>
          <h2 className="text-white text-lg font-black tracking-tight">CutSync</h2>
        </div>
        <nav className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em]">
            <Link className="text-slate-400 hover:text-white transition-colors" to="/projects">Projects</Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">Asset {assetId}</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
            <Link className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors" to={`/review/${assetId}`}>Review</Link>
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-primary text-white rounded-md">Prep Mode</span>
          </div>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportSRT}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors border border-white/10"
          >
            <Download size={14} /> Export SRT
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors border border-white/10"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1">
          <Sparkles className="text-emerald-500" size={14} />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">AI Analysis Active</span>
        </div>
        <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden bg-white/10 flex items-center justify-center">
            {/* User Icon Placeholder */}
        </div>
      </div>
    </header>
  );
};
