import { pb } from '../lib/pocketbase';
import { ReviewNote } from '../types/review';

export const fetchReviewNotes = async (assetId: string): Promise<ReviewNote[]> => {
  try {
    const records = await pb.collection('review_notes').getFullList<ReviewNote>({
      filter: `asset_id = "${assetId}"`,
      sort: 'timestamp',
      requestKey: null,
    });
    return records;
  } catch (error) {
    console.error("Failed to fetch review notes:", error);
    return [];
  }
};

export const createReviewNote = async (
  assetId: string, 
  author: string, 
  timestamp: number, 
  noteText: string, 
  canvasData?: any
): Promise<ReviewNote | null> => {
  try {
    const data = {
      asset_id: assetId,
      author: author,
      timestamp: timestamp,
      note_text: noteText,
      canvas_data: canvasData || null,
    };
    
    const record = await pb.collection('review_notes').create<ReviewNote>(data, {
      requestKey: null,
    });
    return record;
  } catch (error) {
    console.error("Failed to create review note:", error);
    return null;
  }
};
