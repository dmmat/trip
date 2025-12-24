import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Auto-refresh auth state (only in development)
if (import.meta.env.DEV) {
  pb.authStore.onChange(() => {
    console.log('Auth state changed:', pb.authStore.isValid);
  });
}

export default pb;
