import PocketBase from 'pocketbase';

// The PocketBase server is expected to run on port 8090 on the same host as the frontend.
export const pb = new PocketBase(window.location.protocol + "//" + window.location.hostname + ":8090");
