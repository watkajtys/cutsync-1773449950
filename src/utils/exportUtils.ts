import { formatTimecode } from './timeFormat';

const formatSRTTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  const ms = Math.floor((seconds - Math.floor(seconds)) * 1000).toString().padStart(3, '0');
  return `${h}:${m}:${s},${ms}`;
};

export const exportTranscriptAsSRT = (transcripts: any[]) => {
  let srtContent = '';
  transcripts.forEach((transcript, index) => {
    if (transcript.srt_payload) {
      srtContent += `${transcript.srt_payload}\n\n`;
    } else {
      const mockTime = index * 10;
      const mockEndTime = mockTime + 10;
      srtContent += `${index + 1}\n`;
      srtContent += `${formatSRTTime(mockTime)} --> ${formatSRTTime(mockEndTime)}\n`;
      srtContent += `${transcript.raw_text}\n\n`;
    }
  });
  return srtContent.trim();
};

export const exportCutSuggestionsAsCSV = (cutSuggestions: any[]) => {
  let csvContent = 'Start Timecode,End Timecode,Reason\n';
  cutSuggestions.forEach((suggestion) => {
    const start = formatTimecode(suggestion.start_timecode, false);
    const end = formatTimecode(suggestion.end_timecode, false);
    // Escape quotes in reason
    const reason = `"${(suggestion.cut_reason || '').replace(/"/g, '""')}"`;
    csvContent += `${start},${end},${reason}\n`;
  });
  return csvContent;
};

export const downloadBlob = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
