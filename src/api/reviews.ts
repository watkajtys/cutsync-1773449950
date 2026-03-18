import { pb } from '../lib/pocketbase';
import { ReviewNote, Shape } from '../types/review';
import { serializeAnnotations, deserializeAnnotations } from '../lib/transformers';

export const fetchReviewNotes = async (assetId: string): Promise<ReviewNote[]> => {
  try {
    const records = await pb.collection('review_notes').getFullList<ReviewNote>({
      filter: `asset_id = "${assetId}"`,
      sort: 'timestamp',
      requestKey: null,
    });
    
    // Process and normalize canvas_data safely via our transformer logic
    return records.map(record => ({
      ...record,
      canvas_data: record.canvas_data ? deserializeAnnotations(record.canvas_data) : null
    }));
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
    // Isolate serialization logic to safely prepare for backend persistence 
    const serializedCanvasData = serializeAnnotations(canvasData);

    const record = await pb.collection('review_notes').create<ReviewNote>({
      asset_id: assetId,
      author: author,
      timestamp: timestamp,
      note_text: noteText,
      canvas_data: serializedCanvasData as unknown as Shape[]
    }, { requestKey: null });
    
    return {
      ...record,
      canvas_data: record.canvas_data ? deserializeAnnotations(record.canvas_data) : null
    };
  } catch (error) {
    console.error("Error creating review note:", error);
    throw error;
  }
};
