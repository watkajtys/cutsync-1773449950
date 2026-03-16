import { pb } from '../lib/pocketbase';
import { ReviewNote, Shape } from '../types/review';

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
    throw error;
  }
};

export const createReviewNote = async (
  assetId: string, 
  author: string, 
  timestamp: number, 
  noteText: string, 
  canvasData: Shape[] | null
): Promise<ReviewNote> => {
  try {
    const record = await pb.collection('review_notes').create<ReviewNote>({
      asset_id: assetId,
      author: author,
      timestamp: timestamp,
      note_text: noteText,
      canvas_data: canvasData
    }, { requestKey: null });
    return record;
  } catch (error) {
    console.error("Error creating review note:", error);
    throw error;
  }
};
