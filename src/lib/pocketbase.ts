import PocketBase from 'pocketbase';

// Determine the URL based on environment variables or fallback logic
const url = import.meta.env.VITE_POCKETBASE_URL || 'http://loom-cutsync-pocketbase:8090';

export const pb = new PocketBase(url);
