import React from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
}

interface ChronologicalRiverProps {
  projects: Project[];
}

export const ChronologicalRiver: React.FC<ChronologicalRiverProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-forest-medium rounded-lg text-sage-light/60">
        <p>No projects found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-forest-medium border border-forest-light rounded-xl p-6 hover:border-sage/30 transition-colors">
          <h3 className="text-xl font-medium text-white mb-2">{project.title}</h3>
          <p className="text-sage-light/70 text-sm line-clamp-3">{project.description}</p>
        </div>
      ))}
    </div>
  );
};
