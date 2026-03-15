import React, { useRef, useState } from 'react';
import { UploadCloud, FileVideo, X } from 'lucide-react';

interface AssetUploaderProps {
  onFileSelect: (file: File | null, assetType: string) => void;
}

export const AssetUploader: React.FC<AssetUploaderProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assetType, setAssetType] = useState<string>('source_clip');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.type === "video/mp4" || file.type === "video/webm") {
      setSelectedFile(file);
      onFileSelect(file, assetType);
    } else {
      alert("Please upload an MP4 or WebM video file.");
    }
  };

  const handleAssetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setAssetType(newType);
    if (selectedFile) {
      onFileSelect(selectedFile, newType);
    }
  };

  const triggerFileSelect = () => {
    inputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null, assetType);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label htmlFor="asset_type" className="block text-sm font-medium text-slate-300 mb-1">
          Asset Type
        </label>
        <select
          id="asset_type"
          value={assetType}
          onChange={handleAssetTypeChange}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        >
          <option value="source_clip">Source Clip</option>
          <option value="review_edit">Review Edit</option>
        </select>
      </div>

      {!selectedFile ? (
        <div 
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
            dragActive ? 'border-blue-500 bg-blue-500/5' : 'border-slate-700 bg-slate-950 hover:border-slate-500 hover:bg-slate-900'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept="video/mp4,video/webm" 
            onChange={handleChange}
          />
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-300">
            <UploadCloud size={20} />
          </div>
          <h3 className="text-sm font-medium text-white mb-1">Drag & drop source video</h3>
          <p className="text-xs text-slate-400">MP4 or WebM up to 500MB</p>
        </div>
      ) : (
        <div className="border border-slate-700 rounded-xl p-4 bg-slate-950 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center shrink-0 text-blue-400">
            <FileVideo size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{selectedFile.name}</p>
            <p className="text-xs text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
          <button 
            type="button"
            onClick={removeFile}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-md hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
