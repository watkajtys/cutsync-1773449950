import { pb } from '../lib/pocketbase';
import { Asset } from '../types/asset';

export const createAsset = async (file: File, projectId: string, assetType: string): Promise<Asset> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);
    formData.append('asset_type', assetType);
    formData.append('processing_status', 'pending');

    const record = await pb.collection('assets').create<Asset>(formData, { requestKey: null });
    return record;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
};
