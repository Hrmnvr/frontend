// ScholarX Frontend Configuration
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAgHL_pF1SIc2RjePrb2FTmw4K_S2jdJGc",
  authDomain: "scholarx-45651.firebaseapp.com",
  projectId: "scholarx-45651",
  storageBucket: "scholarx-45651.firebasestorage.app",
  messagingSenderId: "478572833543",
  appId: "1:478572833543:web:fd7d772191e3b6ece4b3a2",
  measurementId: "G-1Z7NT4ZM62"
};

// Backend URL Configuration
// Priority: localStorage > environment > production ngrok > localhost dev
const getBackendUrl = () => {
  // 1. Check localStorage (user override)
  const stored = localStorage.getItem('sx_backend_url');
  if (stored) return stored;

  // 2. Check for environment variable (build-time config)
  if (typeof window !== 'undefined' && window.SCHOLARX_BACKEND_URL) {
    return window.SCHOLARX_BACKEND_URL;
  }

  // 3. Production ngrok URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://augitic-lyndsay-overflowingly.ngrok-free.dev';
  }

  // 4. Local development fallback
  return 'http://localhost:8000';
};

export const BACKEND_URL = getBackendUrl();
export const API_BASE = `${BACKEND_URL}/api/v1`;
