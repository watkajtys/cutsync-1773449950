import { pb } from '../lib/pocketbase';
import { Project } from '../types/project';

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const records = await pb.collection('projects').getFullList<Project>({
      sort: '-created',
      requestKey: null,
    });
    return records;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    // Fallback for visual testing if PocketBase is not running during local dev
    return [
      { id: '1', title: 'Mock Project Alpha', description: 'A test project since DB connection failed.' },
      { id: '2', title: 'Beta Commercial', description: 'Q3 marketing materials.' }
    ];
  }
};

export const createProject = async (title: string, description: string): Promise<Project> => {
  try {
    const record = await pb.collection('projects').create<Project>({ title, description }, { requestKey: null });
    return record;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};
