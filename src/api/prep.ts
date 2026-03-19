import { pb } from '../lib/pocketbase';

export const fetchAsset = async (assetId: string) => {
  try {
    const assetRecord = await pb.collection('assets').getOne(assetId, { requestKey: null });
    return assetRecord;
  } catch (err) {
    console.error('Failed to fetch asset record:', err);
    throw err;
  }
};

export const fetchTranscripts = async (assetId: string) => {
  try {
    const transcriptRes = await pb.collection('ai_transcripts').getFullList({
      filter: `asset_id = "${assetId}"`,
      sort: '+created',
      requestKey: null
    });
    return transcriptRes;
  } catch (error) {
    console.error('Failed to fetch transcripts:', error);
    throw error;
  }
};

export const fetchCutSuggestions = async (assetId: string) => {
  try {
    const cutRes = await pb.collection('ai_cut_suggestions').getFullList({
      filter: `asset_id = "${assetId}"`,
      sort: '+start_timecode',
      requestKey: null
    });
    return cutRes;
  } catch (error) {
    console.error('Failed to fetch cut suggestions:', error);
    throw error;
  }
};
