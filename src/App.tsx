import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { pb } from './lib/pocketbase';
import { ChronologicalRiver, Project } from './components/dashboard/ChronologicalRiver';
import { NewProjectModal } from './components/modals/NewProjectModal';

function DashboardContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const isNewProjectModalOpen = searchParams.get('modal') === 'new-project';
  const currentView = searchParams.get('view') || 'projects';

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await pb.collection('projects').getFullList<Project>({
        sort: '-created',
        requestKey: null,
      });
      setProjects(records);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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

  const handleCreateProject = async (title: string, description: string) => {
    try {
      await pb.collection('projects').create({ title, description }, { requestKey: null });
      await fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  };

  return (
    <div className="flex h-screen bg-forest-dark text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-forest-medium border-r border-forest-light flex-col justify-between hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded bg-sage flex items-center justify-center shadow-lg shadow-sage/20">
              <span className="material-symbols-outlined text-[20px] text-forest-dark">movie</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              CutSync
            </h1>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => navigate('/?view=projects')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${currentView === 'projects' ? 'bg-sage/10 text-sage font-medium' : 'text-sage-light/60 hover:text-white hover:bg-forest-light/50'}`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              Projects
            </button>
            <button 
              onClick={() => navigate('/?view=recent')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${currentView === 'recent' ? 'bg-sage/10 text-sage font-medium' : 'text-sage-light/60 hover:text-white hover:bg-forest-light/50'}`}
            >
              <span className="material-symbols-outlined text-[18px]">folder</span>
              Recent Assets
            </button>
          </div>
        </div>

        <div className="p-6">
          <button 
            onClick={() => navigate('/?view=settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${currentView === 'settings' ? 'bg-sage/10 text-sage font-medium' : 'text-sage-light/60 hover:text-white hover:bg-forest-light/50'}`}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Settings
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 border-b border-forest-light flex items-center justify-between px-8 shrink-0 bg-forest-dark/80 backdrop-blur-md z-10">
          <h2 className="text-2xl font-semibold capitalize">{currentView}</h2>
          
          {currentView === 'projects' && (
            <button
              onClick={openNewProjectModal}
              className="flex items-center gap-2 bg-sage hover:bg-sage-light text-forest-dark px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-sage/20"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Project
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-sage-light/60">
              Loading...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-400">
              {error}
            </div>
          ) : (
            <>
              {currentView === 'projects' && <ChronologicalRiver projects={projects} />}
              {currentView === 'recent' && <div className="text-sage-light/60">Recent assets will appear here.</div>}
              {currentView === 'settings' && <div className="text-sage-light/60">System settings configuration.</div>}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      {isNewProjectModalOpen && (
        <NewProjectModal 
          onClose={closeNewProjectModal} 
          onSubmit={handleCreateProject} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardContent />} />
      </Routes>
    </Router>
  );
}
