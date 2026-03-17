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

export const updateReviewNote = async (
  noteId: string,
  canvasData: Shape[] | null
): Promise<ReviewNote> => {
  try {
    const record = await pb.collection('review_notes').update<ReviewNote>(noteId, {
      canvas_data: canvasData
    }, { requestKey: null });
    return record;
  } catch (error) {
    console.error("Error updating review note:", error);
    throw error;
  }
};

export const deleteReviewNote = async (noteId: string): Promise<boolean> => {
  try {
    await pb.collection('review_notes').delete(noteId, { requestKey: null });
    return true;
  } catch (error) {
    console.error("Error deleting review note:", error);
    return false;
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
