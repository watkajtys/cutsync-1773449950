import PocketBase from 'pocketbase';

// The PocketBase server is expected to run on port 8090 on the same host as the frontend.
// Use 127.0.0.1 explicitly to avoid IPv6 localhost resolution issues that cause ERR_CONNECTION_REFUSED
export const pb = new PocketBase("http://127.0.0.1:8090");
