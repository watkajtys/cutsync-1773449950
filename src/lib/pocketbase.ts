import PocketBase from 'pocketbase';

// Determine the URL based on environment variables or fallback logic
const url = import.meta.env?.VITE_POCKETBASE_URL || (typeof window !== 'undefined' ? window.location.protocol + '//' + window.location.hostname + ':8090' : 'http://127.0.0.1:8090');

export const pb = new PocketBase(url);
