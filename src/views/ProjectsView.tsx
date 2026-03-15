import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ChronologicalRiver } from '../components/dashboard/ChronologicalRiver';
import { NewProjectModal } from '../components/modals/NewProjectModal';
import { Project } from '../types/project';
import { fetchProjects, createProject } from '../api/projects';
import { createAsset } from '../api/assets';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const isNewProjectModalOpen = searchParams.get('modal') === 'new-project';

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const records = await fetchProjects();
      setProjects(records);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openNewProjectModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', 'new-project');
    setSearchParams(params);
  };

  const closeNewProjectModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('modal');
    setSearchParams(params);
  };

  const handleCreateProject = async (title: string, description: string, file: File | null, assetType: string) => {
    const newProject = await createProject(title, description);
    
    if (file) {
      await createAsset(file, newProject.id, assetType);
    }

    await loadProjects();
  };

  return (
    <>
      <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 shrink-0 bg-slate-950/50 backdrop-blur-md z-10">
        <h2 className="text-2xl font-semibold capitalize">Projects</h2>
        
        <button
          onClick={openNewProjectModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          New Project
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            Loading...
          </div>
        ) : (
          <ChronologicalRiver projects={projects} />
        )}
      </div>

      {isNewProjectModalOpen && (
        <NewProjectModal 
          onClose={closeNewProjectModal} 
          onSubmit={handleCreateProject} 
        />
      )}
    </>
  );
};
