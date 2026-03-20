import { pb } from '../lib/pocketbase';
import { Project } from '../types/project';

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const records = await pb.collection('projects').getFullList<Project>({
      sort: '-created',
      requestKey: null,
    });
    return records.map(record => ({
      ...record,
      id: record.id || crypto.randomUUID()
    }));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
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
