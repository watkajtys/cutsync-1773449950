import PocketBase from 'pocketbase';

// The PocketBase server is expected to run on port 8090 on the same host as the frontend.
export const pb = new PocketBase(
  typeof window !== 'undefined'
    ? window.location.protocol + '//' + window.location.hostname + ':8090'
    : 'http://127.0.0.1:8090'
);
