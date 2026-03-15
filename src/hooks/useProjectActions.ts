import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types/project';
import { fetchProjects, createProject } from '../api/projects';
import { createAsset } from '../api/assets';

export const useProjectActions = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const records = await fetchProjects();
      setProjects(records);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = async (title: string, description: string, file: File | null, assetType: string) => {
    const newProject = await createProject(title, description);
    
    if (file) {
      await createAsset(file, newProject.id, assetType);
    }

    await loadProjects();
  };

  return {
    projects,
    isLoading,
    handleCreateProject,
  };
};
