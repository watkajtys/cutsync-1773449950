export type Tool = 'pointer' | 'freehand' | 'rect' | 'arrow';
export interface Point { x: number; y: number }
export interface Shape {
  tool: Tool;
  color: string;
  points: Point[];
}

export interface ReviewNote {
  id: string;
  asset_id: string;
  author: string;
  timestamp: number;
  note_text: string;
  canvas_data: Shape[] | null;
  created: string;
}
