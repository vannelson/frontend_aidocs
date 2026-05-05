# GoodDocs Frontend

React frontend for the GoodDocs assignment.

## Stack

- React
- JavaScript only
- Redux Toolkit
- Chakra UI
- Vite
- Tiptap editor

## Features Implemented

- Login and registration
- Seeded demo account login
- Create, open, rename, edit, autosave, and delete documents
- Rich-text formatting:
  - bold
  - italic
  - underline
  - headings
  - bullet lists
  - numbered lists
- Import `.txt` and `.md` files into new editable documents
- Frontend-only PDF export
- Sharing modal with:
  - add collaborators
  - current access table
  - inline role update for shared users
- Clear distinction between:
  - `Owned by me`
  - `Shared with me`

## Supported File Types

Import is intentionally limited to:

- `.txt`
- `.md`

`.docx` is not supported in this build.

## Demo Accounts

- `ava@gooddocs.test` / `password123`
- `ben@gooddocs.test` / `password123`
- `cara@gooddocs.test` / `password123`

You can also register a new account from the auth screen.

## Environment

Create `.env` if needed from `.env.example`.

Current local values:

```env
VITE_API_BASE_URL=/api/v1
VITE_DEV_PROXY_TARGET=http://127.0.0.1:8000
```

## Setup

1. Open a terminal in `frontend_aidocs`.
2. Install dependencies:

```powershell
cmd /c npm install
```

3. Start the frontend dev server:

```powershell
cmd /c npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

## Backend Requirement

The Laravel backend must already be running on:

```txt
http://127.0.0.1:8000
```

Start it from `backend_aidocs` with:

```powershell
php artisan serve
```

## Useful Commands

Lint:

```powershell
cmd /c npm run lint
```

Production build:

```powershell
cmd /c npm run build
```

## Main User Flows

1. Sign in with a seeded or registered account.
2. Create a new document or import a `.txt` / `.md` file.
3. Edit the document with rich text formatting.
4. Save manually or rely on autosave.
5. Share the document with another user.
6. Review shared collaborators and update their role.
7. Switch accounts to verify `Owned by me` vs `Shared with me`.

## UI Notes

- Owners see delete and share controls for owned documents.
- Shared documents do not expose owner-only actions.
- Viewers can open documents but cannot edit them.
- PDF export is generated on the frontend directly from the current document content.
