import React from 'react';
import { Project } from '../../types/project';

interface ProjectGridProps {
  projects: Project[];
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-lg text-slate-400">
        <p>No projects found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={String(project.id)} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
          <h3 className="text-xl font-medium text-white mb-2">{project.title}</h3>
          <p className="text-slate-400 text-sm line-clamp-3">{project.description}</p>
        </div>
      ))}
    </div>
  );
};
