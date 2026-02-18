# ScholarX Project Guidelines for AI Continuation

> **Purpose**: This file helps any AI model (Claude, GPT, etc.) continue building this project. Always update the "Session Log" section at the bottom after making changes.

---

## Project Overview

**ScholarX** is an AI-powered education platform for Indian students (Classes 5-12 + College) and teachers.

- **Backend**: Python FastAPI at `backend/` — runs on `localhost:8000`
- **Frontend**: Plain HTML/CSS/JS (no React/framework) at `frontend/` — each page is standalone with inline `<script type="module">` blocks
- **Auth**: Firebase Authentication (Google OAuth, GitHub OAuth, Email/Password)
- **Database**: Firestore (all user data, classrooms, assignments, notes, etc.)
- **File Storage**: Cloudinary (PDF uploads, NOT Firebase Storage)
- **AI Service**: Groq API via `backend/services/groq_service.py`
- **Real-time**: Socket.IO configured in `backend/main.py` for live quiz (not yet built)

---

## Tech Stack Details

| Layer | Technology |
|-------|-----------|
| Backend Framework | FastAPI (Python) |
| Auth | Firebase Auth (client-side SDK 11.6.0) |
| Database | Firestore |
| AI/LLM | Groq API |
| File Upload | Cloudinary |
| PDF Processing | `backend/services/pdf_service.py` |
| TTS | `backend/services/tts_service.py` |
| Frontend Styling | Tailwind CSS (CDN) + custom CSS |
| Font | Lexend (Google Fonts) |
| Icons | Material Icons / Material Symbols Outlined |
| Real-time | Socket.IO (python-socketio) |

---

## File Structure

```
scholarx/
├── backend/
│   ├── main.py                    # FastAPI app entry, CORS, Socket.IO, all routers
│   ├── models/
│   │   └── schemas.py             # All Pydantic request/response models
│   ├── routers/
│   │   ├── auth.py                # /api/v1/auth - token verify, register
│   │   ├── study.py               # /api/v1/study - PDF upload, note generation, library
│   │   ├── classroom.py           # /api/v1/classrooms - CRUD, join with code
│   │   ├── assignment.py          # /api/v1/assignments - create, submit, grade
│   │   ├── tutor.py               # /api/v1/tutor - AI doubt solver
│   │   ├── studio.py              # /api/v1/studio - content generation
│   │   ├── assessment.py          # /api/v1/assessments - assessment builder
│   │   └── gamification.py        # /api/v1/gamification - XP, leaderboard
│   ├── services/
│   │   ├── firebase_service.py    # Firestore CRUD helpers
│   │   ├── groq_service.py        # Groq LLM API calls
│   │   ├── cloudinary_service.py  # File upload to Cloudinary
│   │   ├── pdf_service.py         # PDF text extraction & chunking
│   │   ├── tts_service.py         # Text-to-speech
│   │   ├── tutor_service.py       # AI tutor logic
│   │   └── studio_service.py      # Content studio logic
│   ├── middleware/
│   │   └── auth_middleware.py     # Firebase token verification, role checks
│   └── utils/
│       └── helpers.py             # Join codes, sanitization, rate limiting, file validation
├── frontend/
│   ├── js/
│   │   ├── config.js              # Firebase config + API_BASE (localhost:8000/api/v1)
│   │   ├── auth.js                # Shared: initAuth, apiCall, loadUserProfile, logout, getGreeting
│   │   ├── validation.js          # Shared: validateEmail, validatePassword, showToast, setButtonLoading
│   │   └── sidebar.js             # Sidebar render by role (student/teacher nav items)
│   ├── styles/
│   │   └── shared.css             # Common styles (toast, modal-backdrop, field-error, etc.)
│   └── pages/
│       ├── index.html             # Landing page
│       ├── scholarx_sign_up.html  # Sign up (email/password + OAuth)
│       ├── scholarx_sign_in.html  # Sign in (email/password + OAuth)
│       ├── account_type_selection.html  # Step 1 onboarding: choose student/teacher
│       ├── profile_setup.html     # Step 2 onboarding: name, grade, board, school
│       ├── student_dashboard.html # Student main dashboard
│       ├── teacher_dashboard.html # Teacher main dashboard
│       ├── settings.html          # Profile settings (edit name, grade, board, school)
│       ├── study_mode_upload.html # Upload PDFs for study
│       ├── study_mode_generating.html # Note generation progress
│       ├── ai_tutor.html          # AI tutor chat interface
│       ├── content_studio.html    # Teacher content generation
│       ├── assessment_builder.html # Teacher assessment builder
│       ├── forgot_password.html   # Password reset
│       └── plan_selection_modal.html # (stub) Plan selection UI
└── product devlopment Guidelines/
    └── PRDs (PDF files with feature specs)
```

---

## Auth Flow (Critical)

```
Sign Up → account_type_selection.html → profile_setup.html → Dashboard
Sign In → Check Firestore doc:
  - No doc exists → account_type_selection.html (onboarding)
  - Doc exists but no role → account_type_selection.html
  - Doc exists, role set, profile NOT completed → profile_setup.html
  - Doc exists, role set, profile completed → appropriate dashboard
```

### Firestore User Document (`users/{uid}`)
```json
{
  "displayName": "string",
  "email": "string",
  "accountType": "student|teacher",
  "role": "student|teacher",
  "board": "cbse|icse|ib|state",
  "grade": "5-12|college",
  "school": "string",
  "subjects": ["array"],
  "photoURL": "string",
  "xp": 0,
  "level": 1,
  "streakDays": 0,
  "badges": [],
  "profileCompleted": true,
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

**Note**: Both `role` and `accountType` store the same value. Always check both: `data.role || data.accountType`.

---

## Conventions

1. **Frontend pages** are standalone HTML - each imports Firebase SDK from CDN and shared JS modules
2. **Tailwind config** is duplicated in each HTML `<script id="tailwind-config">` block (primary: `#7c70ff`)
3. **API calls** from frontend use `apiCall()` from `auth.js` which adds Bearer token
4. **Backend auth** uses `get_current_user` dependency from `auth_middleware.py` - verifies Firebase token
5. **Role checks**: `require_teacher` and `require_student` dependencies in `auth_middleware.py`
6. **Firestore writes** from frontend use Firebase client SDK directly (merge: true)
7. **Toast notifications**: Use `showToast(message, type)` from `validation.js` (types: success, error, info)
8. **Button loading**: Use `setButtonLoading(btn, isLoading, text)` from `validation.js`

---

## What's Built (Working)

- [x] Firebase Auth (sign up, sign in, OAuth - Google/GitHub)
- [x] Onboarding flow (account type selection + profile setup)
- [x] Student Dashboard (XP, stats, classrooms, join classroom)
- [x] Teacher Dashboard (classrooms, create classroom, assessments)
- [x] Settings page (view/edit profile)
- [x] Study Mode Upload (PDF upload to Cloudinary)
- [x] Note Generation (via Groq AI, SSE progress)
- [x] Library (list user's notes/documents)
- [x] Classroom CRUD (create, join with code, list, leave)
- [x] Assignments (create, submit, grade)
- [x] AI Tutor (chat with AI about topics)
- [x] Content Studio (teacher generates content with AI)
- [x] Assessment Builder (generate assessments with AI)
- [x] Gamification basics (XP, levels, leaderboard endpoint)

---

## What's NOT Built Yet (Per PRD)

### Priority 1 - Core Missing Features
- [ ] **Live Quiz Mode** - Real-time Socket.IO quiz with join codes (no router exists)
- [ ] **Rizz Mode** - Gen-Z slang auto-updater for notes (PRD feature)
- [ ] **Free Trial System** - 15-min hidden timer, no credit card required
- [ ] **Razorpay Payment Integration** - Plans: Basic (₹99), Standard (₹299), Premium (₹599)
- [ ] **Plan Selection Modal** - `plan_selection_modal.html` exists but is a stub
- [ ] **Plan Enforcement Middleware** - Backend middleware to check subscription status

### Priority 2 - Enhancements
- [ ] **Student sidebar** should include: Library, Classrooms, Assignments, Settings links
- [ ] **Teacher sidebar** should include: Classrooms, Assignments, Assessment Builder, Content Studio, Settings
- [ ] **Quiz router** - `backend/routers/quiz.py` needs to be created
- [ ] **Assignment grading** - Auto-grade with AI
- [ ] **Streak tracking** - Daily login streak
- [ ] **Badge system** - Award badges for achievements
- [ ] **Notifications system** - In-app notifications

### Priority 3 - Polish
- [ ] **Mobile responsive** - Some pages may need mobile layout fixes
- [ ] **Error pages** - 404, 500
- [ ] **Loading skeletons** - Better loading states
- [ ] **PWA support** - Service worker, manifest

---

## Fixes Applied (Session History)

### Session 1 (Feb 2026)
**Fix 1**: `scholarx_sign_in.html` - `redirectByRole()` now checks both `data.role` and `data.accountType`. New users without a Firestore doc are redirected to `account_type_selection.html` instead of `student_dashboard.html`. Users with incomplete profiles go to `profile_setup.html`.

**Fix 2**: `student_dashboard.html` - Fixed `greetingPrefix` undefined variable bug. Changed to `document.getElementById('greetingPrefix')`.

**Fix 3**: `backend/routers/auth.py` - Fixed `register_user` endpoint that had two separate body parameters (`UserCreate` + `TokenVerifyRequest`) which FastAPI can't parse. Combined into single `RegisterRequest` schema.

**Fix 4**: `backend/models/schemas.py` - Added `RegisterRequest` model combining `id_token` with user registration fields.

**Fix 5**: `account_type_selection.html` - Fixed card selection visuals. `peer-checked:` Tailwind classes on nested elements (choose button, checkmark) don't work because they're not direct siblings of the radio input. Moved checkmark divs to be siblings of the input and added CSS rules using `input[name="account_type"]:checked ~ .role-card .choose-btn` selector.

**Fix 6**: `frontend/js/sidebar.js` - Added missing nav items. Student sidebar now includes Classrooms and Assignments. Teacher sidebar now includes Classrooms and Assignments.

**Fix 7**: `study_mode_upload.html` - Removed hardcoded `grade: '10', board: 'CBSE'` in generate-notes API call. Now reads from user profile data loaded on page init.

**Fix 8**: `study_mode_generating.html` - Removed hardcoded "Arjun Patel" name and "Class 12 - Science" info. Added Firebase auth integration to load user name/grade/board from Firestore dynamically.

**Fix 9**: `content_studio.html` - Added Firestore import and profile loading. Teacher name now comes from Firestore `displayName` instead of `user.displayName` (Firebase Auth only). Board/grade selectors pre-filled from profile.

**Fix 10**: `assessment_builder.html` - Same as Fix 9. Added Firestore profile loading and board/grade pre-fill.

**Fix 11**: `settings.html` - Removed hardcoded fallback `grade: '10', board: 'cbse'` for dropdowns. Added neutral "Select grade"/"Select board" placeholder options. Email and role display always set regardless of Firestore data.

**Fix 12**: Standardized board option values across all pages to lowercase (`cbse`, `icse`, `state`, `ib`) to match Firestore storage format. Previously `ai_tutor.html`, `content_studio.html`, and `assessment_builder.html` used uppercase values causing pre-fill mismatches.

**Fix 13**: `student_dashboard.html` - Greeting now always updates with time-aware prefix (`getGreeting()`) even when no Firestore data exists, using Firebase Auth displayName as fallback.

**Fix 14**: `groq_service.py` - Removed hardcoded "CBSE pattern" in unit_test config. Now says "board exam pattern" (actual board is passed via the board_info variable).

---

## Instructions for Continuing AI Model

1. **Read this file first** to understand the project state
2. **Read the PRD PDFs** in `product devlopment Guidelines/` for full feature specs
3. **Check the "What's NOT Built Yet" section** above for next tasks
4. **Follow existing patterns** - look at how existing routers/pages are structured before adding new ones
5. **Test changes** by running: `cd scholarx/backend && python main.py` (backend) and opening HTML files directly (frontend uses CDN, no build step)
6. **Update this file** after making changes - add to "Fixes Applied" section with date and description
7. **Key files to read first**: `auth.js`, `config.js`, `validation.js`, `sidebar.js`, `firebase_service.py`, `auth_middleware.py`, `schemas.py`
