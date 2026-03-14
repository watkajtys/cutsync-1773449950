# Product Roadmap: CutSync (Video Prep & Review Hub)

## Core Objective
Build an autonomous video preparation and review platform (a lightweight Frame.io alternative). The application facilitates two distinct workflows: **"Prep Mode"** (ingesting raw source clips, using Gemini to generate transcripts and suggest cuts for the editor) and **"Review Mode"** (sharing a finished edit for stakeholders to leave timestamped notes with canvas drawings).

---

## Global Data Model
These collections must be provisioned in PocketBase to support the frontend views and the Python background workers.

```json
[
  {"name": "projects", "type": "base", "schema": [
    {"name": "title", "type": "text"},
    {"name": "description", "type": "text"}
  ]},
  {"name": "assets", "type": "base", "schema": [
    {"name": "project_id", "type": "relation", "options": {"collectionId": "projects", "maxSelect": 1}},
    {"name": "file", "type": "file", "options": {"maxSelect": 1, "maxSize": 524288000, "mimeTypes": ["video/mp4", "video/webm"]}},
    {"name": "asset_type", "type": "select", "options": {"values": ["source_clip", "review_edit"]}},
    {"name": "processing_status", "type": "select", "options": {"values": ["pending", "extracting_audio", "analyzing", "ready", "error"]}}
  ]},
  {"name": "ai_transcripts", "type": "base", "schema": [
    {"name": "asset_id", "type": "relation", "options": {"collectionId": "assets", "maxSelect": 1}},
    {"name": "raw_text", "type": "text"},
    {"name": "srt_payload", "type": "text"}
  ]},
  {"name": "ai_cut_suggestions", "type": "base", "schema": [
    {"name": "asset_id", "type": "relation", "options": {"collectionId": "assets", "maxSelect": 1}},
    {"name": "start_timecode", "type": "number"},
    {"name": "end_timecode", "type": "number"},
    {"name": "cut_reason", "type": "text"}
  ]},
  {"name": "review_notes", "type": "base", "schema": [
    {"name": "asset_id", "type": "relation", "options": {"collectionId": "assets", "maxSelect": 1}},
    {"name": "author", "type": "text"},
    {"name": "timestamp", "type": "number"},
    {"name": "note_text", "type": "text"},
    {"name": "canvas_data", "type": "json"}
  ]}
]
```

---

### Phase 1: Dashboard Shell & Core UI Design
**Type:** Frontend UI + Layout (requires_design: true)
**Goal:** Establish the primary visual design system, navigation shell, and project listing views.
**Engineering Requirements:**
- Scaffold the React application and configure React Router.
- Build the main navigation sidebar allowing users to switch between "Projects", "Recent Assets", and "Settings".
- Build the `ProjectDashboard` component to list existing projects in a grid and provide a modal/form to create new ones.
- Design the `AssetUploader` component with drag-and-drop affordances, ensuring it looks cohesive with the platform identity.
- *Do not connect to PocketBase yet; use mock data to fulfill the visual design requirements.*

---

### Phase 2: PocketBase Integration & File Ingestion
**Type:** Frontend State + API (requires_design: false)
**Goal:** Wire the Phase 1 UI to the actual backend database to allow real video uploads.
**Engineering Requirements:**
- Initialize the PocketBase client in the React app.
- Wire the `ProjectDashboard` to create and read from the `projects` collection.
- Wire the `AssetUploader` component to upload actual `.mp4` files to the `assets` collection. The uploader must allow the user to define the `asset_type` (`source_clip` or `review_edit`) before saving.
- Set the default `processing_status` to `pending`.

---

### Phase 3: Theater Mode & The "Review" Shell
**Type:** Frontend UI + Layout (requires_design: true)
**Goal:** Design the core viewing experience for reviewing finished edits with clients.
**Engineering Requirements:**
- Build the `ReviewMode` view.
- It must feature a "Theater Mode" large custom HTML5 video player taking up the left 70% of the screen.
- It must feature a `NotesSidebar` taking up the right 30% of the screen.
- *Visual Only: Render mock timestamped notes in the sidebar so the Genesis agent can style them cleanly.*

---

### Phase 4: Review Logic & Video Sync
**Type:** Frontend State + Logic (requires_design: false)
**Goal:** Make the Review UI functional so users can leave and navigate timestamped notes.
**Engineering Requirements:**
- Wire the custom video player to accurately track `currentTime`.
- **Keyboard Shortcut:** Implement an event listener so pressing `Spacebar` pauses the video and auto-focuses an input field in the `NotesSidebar` to add a new note.
- Saving a note must write a record to the `review_notes` collection with the exact `timestamp` captured from the player.
- Clicking an existing note in the sidebar must scrub the video player directly to that `timestamp`.

---

### Phase 5: Background Audio Extractor Daemon
**Type:** Pure Python Backend (requires_design: false)
**Goal:** Prevent the server from sending massive video files to external APIs by stripping them down to lightweight audio locally.
**Engineering Requirements:**
- Create a Python background daemon (`extractor_agent.py`) that polls the `assets` table for records where `asset_type == "source_clip"` and `processing_status == "pending"`.
- When found, update status to `extracting_audio`.
- Download the video file from PocketBase to a temporary local `/tmp` directory.
- Use `ffmpeg-python` (or raw subprocess `ffmpeg`) to extract the audio track and export it as a highly compressed `.mp3` or `.ogg` file.
- Update status to `analyzing`.

---

### Phase 6: Gemini Audio Intelligence 
**Type:** Pure Python Backend (requires_design: false)
**Goal:** Send the extracted audio to Gemini to generate transcripts and identify rambling/dead space.
**Engineering Requirements:**
- Update the Python daemon to take the extracted audio file and upload it to the `gemini-1.5-pro` API (using the File API).
- Prompt the model to act as an Assistant Video Editor. It must return a structured JSON response containing:
  1. A full transcript with timestamps.
  2. A list of "Cut Suggestions" (start time, end time, and a reason like "Dead air", "Rambling", or "Multiple takes of same line").
- Parse the JSON response and write the data into the `ai_transcripts` and `ai_cut_suggestions` PocketBase collections.
- Update the asset status to `ready` and clean up the temporary files.

---

### Phase 7: The "Prep" View & AI Workspace
**Type:** Frontend UI + Logic (requires_design: true)
**Goal:** Give the video editor a clean interface to review the AI's prep work before opening their editing software.
**Engineering Requirements:**
- Build the `PrepMode` view specifically for viewing `source_clip` assets.
- Display the video player next to the AI-generated transcript, highlighting the current text as the video plays.
- Display a timeline or sidebar list of the `ai_cut_suggestions` pulled from the database.
- Build an "Export Data" module that allows the editor to download the transcript as a formatted `.srt` file, and download the cut suggestions as a `.csv` format to import directly into Premiere/Resolve.

---

### Phase 8: Canvas Drawing Annotations (Review MVP)
**Type:** Frontend UI + State (requires_design: false)
**Goal:** Allow reviewers to draw simple shapes on paused frames to visually indicate fixes.
**Engineering Requirements:**
- Update the custom video player in `ReviewMode` to overlay an absolute-positioned HTML5 `<canvas>` element when the video is paused.
- Allow the user to draw simple bounding boxes or freehand lines on the frame using their mouse.
- When the note is saved, serialize the canvas drawing data (or relative coordinates) into the `canvas_data` JSON field of the `review_notes` collection.
- When scrubbing to a timestamp with an attached drawing, re-render the canvas over the video frame.