import React, { useState } from 'react';

interface NewProjectModalProps {
  onClose: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
  onSuccess?: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose, onSubmit, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSubmitting(true);
    try {
      console.log("Submitting API call to create project with title:", title);
      await onSubmit(title, description);
      console.log("Successfully created project API call returned 200/201");
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-dark/80 backdrop-blur-sm p-4">
      <div className="bg-forest-medium border border-forest-light rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-forest-light">
          <h2 className="text-xl font-semibold text-white">New Project</h2>
          <button 
            onClick={onClose}
            className="text-sage-light/60 hover:text-white transition-colors p-1 rounded-md hover:bg-forest-light"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 flex-1 overflow-y-auto">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-sage-light/80 mb-1">
              Project Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-forest-dark border border-forest-light rounded-lg px-4 py-2.5 text-white placeholder-sage-light/40 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
              placeholder="e.g. Acme Corp Commercial"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-sage-light/80 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-forest-dark border border-forest-light rounded-lg px-4 py-2.5 text-white placeholder-sage-light/40 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all resize-none"
              placeholder="Brief overview of the project scope..."
            />
          </div>
          
          <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-forest-light">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-sage-light/80 bg-forest-light/50 hover:bg-forest-light rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title || isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-forest-dark bg-sage hover:bg-sage-light disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-lg shadow-sage/20"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              {isSubmitting ? 'Saving...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
