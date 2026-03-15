export interface Asset {
  id: string;
  project_id: string;
  file: string;
  asset_type: 'source_clip' | 'review_edit';
  processing_status: 'pending' | 'extracting_audio' | 'analyzing' | 'ready' | 'error';
  created?: string;
  updated?: string;
}
