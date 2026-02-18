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

// Backend URL: set via localStorage or fallback to localhost
// To change: open browser console and run:
//   localStorage.setItem('sx_backend_url', 'https://your-ngrok-url.ngrok-free.app')
// Then reload the page.
const STORED_URL = localStorage.getItem('sx_backend_url');
export const BACKEND_URL = STORED_URL || "http://localhost:8000";
export const API_BASE = `${BACKEND_URL}/api/v1`;
