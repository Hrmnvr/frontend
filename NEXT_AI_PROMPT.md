# ScholarX - Continuation Prompt for Next AI Model

## Context
ScholarX is an AI-powered education platform for Indian students (Classes 5-12 + College) and teachers.
- **Backend**: Running on Ubuntu via ngrok at `https://augitic-lyndsay-overflowingly.ngrok-free.dev`
- **Frontend**: GitHub Pages (ready to deploy)
- **Status**: MVP with several hardcoded/incomplete features

Read these files FIRST:
- `PROJECT_GUIDELINES.md` - Full architecture, tech stack, auth flow, file structure
- `HARDCODED_ISSUES.md` - All broken features and what needs fixing
- Both files are in the root AND in backend/ and frontend/ subdirectories

---

## IMMEDIATE TASKS (In Priority Order)

### TASK 1: Implement Teacher "Create Classroom" Feature ⚠️ CRITICAL
**File**: `frontend/pages/teacher_dashboard.html` + `backend/routers/classroom.py`

**What needs to happen**:
1. Replace the `showCreateClassroom()` stub with a working modal form
2. Form fields: Classroom Name, Subject, Grade, Board (optional)
3. POST to `/api/v1/classrooms/create` with this data
4. On success: redirect to classroom detail page or reload dashboard
5. On error: show error toast
6. Modal should have Cancel and Create buttons

**Backend Check**:
- POST `/classrooms/create` endpoint exists in `classroom.py`
- Verify it saves classroom with join_code generation
- Returns classroom_id in response

**Acceptance Criteria**:
- Teacher can create classroom from UI
- Classroom appears in "My Classrooms" list
- Join code is generated and displayed

---

### TASK 2: Implement Notifications System
**Files**: `student_dashboard.html` + `backend/routers/classroom.py` + `firebase_service.py`

**What needs to happen**:
1. Create notifications collection in Firestore when events happen:
   - Assignment created by teacher → student gets notified
   - Grade updated → student gets notified
   - Classroom invite → student gets notified
   - Due date approaching → student gets notified

2. Backend needs:
   - Add notification creation in relevant endpoints (classroom.py, assignment.py)
   - Helper in firebase_service.py: `create_notification(uid, title, message, type)`

3. Frontend already has UI (notification panel in student_dashboard.html)
   - Just verify it loads notifications from Firestore
   - Badge appears when unread notifications exist

**Backend Endpoints Needed**:
```
POST /api/v1/notifications/send (internal - for teachers/system)
GET /api/v1/notifications/ (student gets their notifications)
PATCH /api/v1/notifications/{id}/read (mark as read)
```

**Acceptance Criteria**:
- Notification badge shows when unread notifications exist
- Notification panel displays all user notifications
- Teachers can see audit log of sent notifications

---

### TASK 3: Implement Content Studio File Upload
**File**: `frontend/pages/content_studio.html` + `backend/routers/studio.py`

**What needs to happen**:
1. When user creates project → can upload PDF textbook
2. File upload modal in content_studio.html already has file input
3. On file select: Upload to Cloudinary (like study_mode_upload.html does)
4. POST `/api/v1/studio/projects/{project_id}/upload` with file
5. Backend chunks PDF, processes with AI, generates materials

**Backend Endpoint**:
```
POST /api/v1/studio/projects/{project_id}/upload
- Accept PDF file
- Process with pdf_service.py
- Generate materials with groq_service.py
- Save to Firestore
```

**Acceptance Criteria**:
- Teacher uploads textbook PDF
- PDF is chunked and processed
- Generated materials appear in project

---

### TASK 4: Fix Content Studio TODO Comment
**File**: `frontend/pages/content_studio.html:858`

**What it says**: `// TODO: implement upload to existing project`

**What to do**:
- Implement ability to upload additional textbooks to an already-created project
- Same as TASK 3 but for existing projects
- Add "Upload New Textbook" button in project detail view

---

### TASK 5: Implement AI Tutor Audio Playback ⚠️ IMPORTANT
**File**: `frontend/pages/ai_tutor.html`

**What needs to happen**:
1. Replace `togglePlay()`, `prevSegment()`, `nextSegment()` stubs with real audio player
2. Each lesson segment has `audioUrl` from backend
3. Implement HTML5 `<audio>` element or Web Audio API
4. Controls:
   - Play/Pause button
   - Previous/Next segment
   - Progress slider
   - Speed control (0.75x, 1x, 1.25x, 1.5x)

**Backend Check**:
- Verify lessons have `audioUrl` field in `LessonSegment` model
- TTS service (tts_service.py) should be generating audio files
- Files stored on Cloudinary

**Acceptance Criteria**:
- User can start lesson and play audio
- Audio persists across page navigation (sessionStorage)
- Can navigate segments while audio plays
- Speed control works

---

### TASK 6: Implement Freemium Plan System
**Files**: `frontend/pages/plan_selection_modal.html` + new backend endpoint

**What needs to happen**:
1. Show pricing modal after sign-up:
   - Free (15 minutes/day)
   - Basic (₹99/month - unlimited)
   - Standard (₹299/month - priority support)
   - Premium (₹599/month - dedicated tutor)

2. Save plan to Firestore user doc: `userProfile.planTier`

3. Enforce limits:
   - Free tier: 15 min/day API access
   - Check in auth_middleware.py before API calls
   - Rate limit by plan tier

4. Checkout with Razorpay:
   - Create endpoint: `POST /api/v1/payments/create-order`
   - Verify endpoint: `POST /api/v1/payments/verify`

**Backend Endpoints**:
```
POST /api/v1/payments/create-order (initiate payment)
POST /api/v1/payments/verify (verify and activate plan)
GET /api/v1/payments/current-plan (get user's current plan)
```

**Acceptance Criteria**:
- User sees plan selection after sign-up
- Plan tier stored in Firestore
- API calls checked against plan tier
- Razorpay checkout works

---

### TASK 7: Implement Search Notes
**File**: `backend/routers/study.py`

**What needs to happen**:
1. Add search endpoint: `GET /api/v1/study/search?q=...`
2. Search user's notes in Firestore by:
   - Title contains query
   - Content contains query (chunk text)
   - Tags contain query
3. Return relevant notes with snippets
4. Frontend (study_mode_upload.html search bar) calls this

**Acceptance Criteria**:
- User can search notes by keyword
- Results show relevant notes with content preview
- Instant search works (debounced API calls)

---

## SETUP INSTRUCTIONS FOR CONTINUING

### Prerequisites
- Read `PROJECT_GUIDELINES.md` completely
- Read `HARDCODED_ISSUES.md` to understand what's broken
- Clone both repos locally
- Have ngrok URL saved: `https://augitic-lyndsay-overflowingly.ngrok-free.dev`

### How to Test
1. **Frontend**: Deploy to GitHub Pages or open locally with: `file:///path/to/scholarx/frontend/index.html`
2. **Password**: `1234`
3. **API calls** automatically route to ngrok URL (set in config.js)
4. **Firebase credentials** already configured (FIREBASE_CONFIG in config.js)

### How to Deploy
After each task:
1. Commit changes: `git add -A && git commit -m "Task X: description"`
2. Push frontend: `git push origin main` (auto-deploys to GitHub Pages)
3. Push backend: `git push origin main` (update docs but backend runs locally on Ubuntu)

---

## Key Files to Know

**Frontend**:
- `frontend/js/config.js` - Backend URL (auto-detects ngrok)
- `frontend/js/auth.js` - Shared auth utilities
- `frontend/js/validation.js` - Shared UI helpers (toast, setButtonLoading)
- `frontend/pages/student_dashboard.html` - Good reference for modal/panel patterns

**Backend**:
- `backend/main.py` - FastAPI app, CORS settings
- `backend/middleware/auth_middleware.py` - Token verification, role checking
- `backend/services/firebase_service.py` - All Firestore CRUD
- `backend/services/groq_service.py` - AI API calls

**Firestore Collections**:
- `users/{uid}` - User profile (displayName, accountType, grade, board, school, planTier, xp, level)
- `classrooms/{id}` - Classrooms (name, subject, grade, join_code, teacher_uid, students)
- `assignments/{id}` - Assignments (title, description, due_date, classroom_id)
- `notes/{id}` - User notes (title, content, owner_uid, created_at)
- `notifications/{id}` - Notifications (uid, title, message, type, read, created_at)

---

## Debugging Tips

1. **Check backend logs** on Ubuntu:
   ```bash
   tail -f ~/scholarx-backend/backend.log
   tail -f ~/scholarx-backend/ngrok.log
   ```

2. **Test API locally**:
   ```bash
   curl https://augitic-lyndsay-overflowingly.ngrok-free.dev/docs
   ```

3. **Browser console** shows auth/API errors with full stack

4. **Firestore Rules**: Make sure auth rules allow user reads/writes to their own data

---

## CONSTRAINTS

- **No breaking changes** to existing working features
- **Follow existing patterns** in code (all code is readable, consistent)
- **Update this prompt** if you discover new issues or tasks
- **Update HARDCODED_ISSUES.md** when tasks are completed
- **Update PROJECT_GUIDELINES.md** with any new deploy info

---

## DONE ✅

Tasks completed in previous session:
- ✅ Password gate (index.html) with auto-login to ngrok backend
- ✅ AI chat sidebar in student dashboard
- ✅ Notification panel stub (UI ready, needs backend)
- ✅ Auto-detect backend URL in config.js
- ✅ Fixed sign-in flow to check both role and accountType
- ✅ Removed hardcoded grade/board defaults
- ✅ Standardized board values to lowercase
- ✅ Both backend and frontend as separate git repos

Next AI: Start with TASK 1 (Create Classroom). Good luck!
