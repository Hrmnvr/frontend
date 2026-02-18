// ============================================================
// ScholarX Shared Auth Utilities
// ============================================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';
import { FIREBASE_CONFIG, API_BASE } from './config.js';

// Initialize Firebase (single source of truth)
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

/**
 * Initialize auth state listener. Redirects to sign-in if not logged in.
 * @param {Function} onUser - Callback with user object when authenticated
 * @param {Object} options - { requireAuth: true, redirectTo: 'scholarx_sign_in.html' }
 */
export function initAuth(onUser, options = {}) {
  const { requireAuth = true, redirectTo = 'scholarx_sign_in.html' } = options;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (onUser) onUser(user);
    } else if (requireAuth) {
      window.location.href = redirectTo;
    }
  });
}

/**
 * Get current user's Firebase ID token
 * @returns {Promise<string|null>}
 */
export async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

/**
 * Make an authenticated API call
 * @param {string} endpoint - API endpoint (e.g. '/study/upload')
 * @param {Object} options - fetch options
 * @returns {Promise<Object>}
 */
export async function apiCall(endpoint, options = {}) {
  const token = await getAuthToken();
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || `Request failed (${res.status})`);
  }

  return res.json();
}

/**
 * Sign out and redirect
 */
export async function logout() {
  await signOut(auth);
  localStorage.clear();
  window.location.href = 'index.html';
}

/**
 * Load user profile from Firestore and update common header UI elements
 * @param {Object} user - Firebase user
 * @param {Object} elements - { nameEl, gradeEl, initialsEl, greetingEl, infoEl }
 */
export async function loadUserProfile(user, elements = {}) {
  const {
    nameEl = document.getElementById('studentNameDisplay') || document.getElementById('teacherName'),
    gradeEl = document.getElementById('studentGradeDisplay'),
    infoEl = document.getElementById('teacherInfo'),
    initialsEl = document.getElementById('studentInitials') || document.getElementById('userInitials'),
    greetingEl = document.getElementById('greetingNameDisplay'),
  } = elements;

  try {
    const docSnap = await getDoc(doc(db, 'users', user.uid));
    if (!docSnap.exists()) {
      // Fallback for UI if no firestore doc yet
      if (nameEl) nameEl.textContent = user.displayName || 'User';
      if (infoEl) infoEl.textContent = user.email || '';
      return null;
    }

    const data = docSnap.data();
    const displayName = data.displayName || user.displayName || 'User';

    // Update Name
    if (nameEl) nameEl.textContent = displayName;

    // Update Info (Email or Role)
    if (infoEl) infoEl.textContent = user.email || '';

    // Update Grade/Board
    if (gradeEl) {
      if (data.grade && data.board) {
        const boardStr = data.board === 'college' ? '' : ` - ${data.board.toUpperCase()}`;
        gradeEl.textContent = data.grade === 'college' ? 'College / University' : `Class ${data.grade}${boardStr}`;
      } else {
        gradeEl.textContent = 'Profile incomplete';
      }
    }

    // Update Greeting (time-aware)
    if (greetingEl) {
      const firstName = displayName.split(' ')[0];
      greetingEl.textContent = firstName;
    }

    // Update Initials
    if (initialsEl) {
      if (displayName && displayName !== 'User' && displayName !== 'Student' && displayName !== 'Teacher') {
        initialsEl.textContent = displayName.charAt(0).toUpperCase();
        initialsEl.classList.remove('material-icons-round');
      } else {
        initialsEl.textContent = 'person';
        initialsEl.classList.add('material-icons-round');
      }
    }

    return data;
  } catch (e) {
    console.error('Error fetching profile:', e);
    return null;
  }
}

/**
 * Get time-aware greeting prefix
 * @returns {string}
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
