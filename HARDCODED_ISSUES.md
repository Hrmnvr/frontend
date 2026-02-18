# ScholarX - Hardcoded & Non-Functional Features

## CRITICAL - BROKEN FEATURES

### 1. **Teacher Dashboard - Create Classroom** ⚠️
- **File**: `frontend/pages/teacher_dashboard.html:297-298`
- **Issue**: Button calls `showCreateClassroom()` which only shows toast "coming soon"
- **Expected**: Should open modal to create classroom with name, subject, grade, board
- **Fix**: Implement classroom creation modal with form submission to `/classrooms/create` endpoint
- **Status**: STUB

### 2. **Teacher Dashboard - Notifications** ⚠️
- **File**: `frontend/pages/teacher_dashboard.html:305`
- **Issue**: Notification button shows toast "coming soon"
- **Expected**: Should display notifications panel like in student dashboard
- **Fix**: Implement notifications panel (copy from student_dashboard.html implementation)
- **Status**: STUB

### 3. **Content Studio - TODO Comment** ⚠️
- **File**: `frontend/pages/content_studio.html:858`
- **Issue**: `// TODO: implement upload to existing project` - feature incomplete
- **Expected**: Should allow uploading new textbooks to existing projects
- **Fix**: Add file upload to project modal
- **Status**: INCOMPLETE

---

## MEDIUM PRIORITY - PARTIAL IMPLEMENTATIONS

### 4. **AI Tutor - Audio Playback**
- **File**: `frontend/pages/ai_tutor.html` (all audio functions)
- **Issue**: `togglePlay()`, `prevSegment()`, `nextSegment()` functions called via `onclick`
- **Expected**: Should play/pause audio segments, navigate lessons
- **Status**: No audio implementation, only HTML buttons
- **Fix**: Need audio player logic with Web Audio API or HTML5 `<audio>` element

### 5. **Assessment Builder - Print/Download**
- **File**: `frontend/pages/assessment_builder.html:387`
- **Issue**: `printAssessment()` calls `window.print()` - basic browser print
- **Expected**: Should format assessment nicely for PDF export
- **Status**: Uses browser print (acceptable but basic)

### 6. **Content Studio - File Upload**
- **File**: `frontend/pages/content_studio.html:276`
- **Issue**: File input exists but upload logic incomplete
- **Expected**: Should upload textbook PDFs to Cloudinary and process
- **Status**: Form exists but backend integration missing

### 7. **Study Mode - Search/Summarize**
- **File**: `frontend/pages/study_mode_upload.html:47`
- **Issue**: Search bar exists but no backend `/search` or `/summarize` endpoint
- **Expected**: Should search notes and generate summaries
- **Status**: UI only, no backend

---

## LOW PRIORITY - PLACEHOLDER ELEMENTS

### 8. **AI Chat Sidebar** (Just implemented)
- **Status**: ✅ WORKING
- **File**: `frontend/pages/student_dashboard.html`
- **Implementation**: `/tutor/chat` endpoint connected

### 9. **Plan Selection Modal**
- **File**: `frontend/pages/plan_selection_modal.html`
- **Issue**: Stub file with no functionality
- **Expected**: Should show pricing tiers and checkout
- **Status**: Not integrated anywhere

### 10. **Notifications**
- **File**: `frontend/pages/student_dashboard.html`
- **Issue**: Firestore query assumes `notifications` collection exists
- **Expected**: Backend needs to create notifications when:
  - Assignment created
  - Grade updated
  - Classroom invite
  - Due date reminder
- **Status**: Frontend UI ready, backend trigger missing

---

## BACKEND ISSUES

### 11. **Notification Creation** ❌
- **Issue**: No endpoint to create notifications
- **Expected**: Teachers should create notifications via API
- **Fix Needed**: POST `/api/v1/notifications/send` endpoint

### 12. **File Upload to Project** ❌
- **Issue**: `uploadToProject()` in content_studio.html has no backend
- **Expected**: POST `/api/v1/studio/projects/{id}/upload` endpoint
- **Fix Needed**: Implement endpoint in `studio.py`

### 13. **Search Notes** ❌
- **Issue**: No search endpoint for notes
- **Expected**: GET `/api/v1/study/search?q=...`
- **Fix Needed**: Firestore query endpoint

---

## FEATURES TO FIX (Priority Order)

1. ✅ **AI Chat Sidebar** - DONE in this session
2. ⚠️ **Teacher Create Classroom** - PRIORITY (blocks teacher workflow)
3. ⚠️ **Notifications System** - PRIORITY (user engagement)
4. ❌ **Content Studio Upload** - Content generation useless without this
5. ❌ **AI Tutor Audio** - Playback needed for voice lessons
6. ❌ **Plan Selection & Checkout** - Revenue depends on this
7. ❌ **Free Trial System** - Per PRD spec

---

## Summary

- **Total Issues**: 13
- **Blocked Features**: 4 (classroom creation, content upload, search, notifications)
- **UI-Only**: 4 (need backend endpoints)
- **Missing**: 3 (audio, plan checkout, trial system)
- **Ready**: 2 (AI chat, gamification)
