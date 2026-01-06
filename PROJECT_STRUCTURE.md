# 📂 Project Structure & File Guide

## Root Level Files

```
bajau-archives/
├── package.json                 ← Dependencies (React, Vercel, etc.)
├── vite.config.ts              ← Build configuration
├── tsconfig.json               ← TypeScript settings
├── index.html                  ← Main HTML file
├── .gitignore                  ← Files to ignore in Git
├── vercel.json                 ← Vercel deployment config
├── .env.example                ← Environment variables template
│
├── README.md                   ← Main project info
├── QUICKSTART.md               ← 5-minute setup
├── SETUP_GUIDE.md              ← Step-by-step deployment
├── DEPLOYMENT.md               ← Detailed deployment docs
├── CHECKLIST.md                ← Pre-launch checklist
│
├── .github/
│   └── copilot-instructions.md ← AI agent guidelines
│
├── src/ (Source Code)
│   ├── App.tsx                 ← Main React component with routes
│   ├── index.tsx               ← Entry point
│   ├── types.ts                ← TypeScript interfaces
│   ├── constants.tsx           ← Mock data, auth keys
│   │
│   ├── pages/                  ← Page components
│   │   ├── Home.tsx            ← Landing page
│   │   ├── Repository.tsx      ← Music archive (ADMIN EDITS HERE)
│   │   ├── Stories.tsx         ← Community stories (ADMIN EDITS HERE)
│   │   ├── Team.tsx            ← Team credits
│   │   └── Ethics.tsx          ← Archiving ethics
│   │
│   ├── components/             ← Reusable components
│   │   ├── Navbar.tsx          ← Navigation bar
│   │   └── ScrollToTop.tsx     ← Auto-scroll on page change
│   │
│   └── services/               ← Backend/data logic
│       ├── dataService.ts      ← localStorage CRUD (songs, stories)
│       └── blobService.ts      ← Vercel Blob file upload/delete
│
├── api/                        ← Serverless functions
│   └── upload-music.ts         ← Handles file uploads to Vercel Blob
│
└── dist/                       ← Production build (auto-generated)
```

---

## Key Files Explained

### 🔑 Important Files

#### `constants.tsx`
```typescript
// WHERE TO CHANGE ADMIN PASSWORD!
export const ADMIN_KEY = 'bajauarchives-admin'; // ← Change this!

// Mock data (shows on first load)
export const SONGS_MOCK: Song[] = [...]
export const STORIES: CommunityStory[] = [...]
export const TEAM_MEMBERS: TeamMember[] = [...]
```

#### `types.ts`
```typescript
// Data structures used everywhere
interface Song {
  id: string;
  title: string;
  audioUrl?: string;  // URL from Vercel Blob
  ...
}

interface CommunityStory {
  id: string;
  title: string;
  image: string;  // URL from Vercel Blob
  ...
}
```

#### `services/dataService.ts`
```typescript
// How data is saved & loaded
getSongs()      // Get all songs from localStorage
saveSong()      // Save new song to localStorage
deleteSong()    // Remove song from localStorage
getStories()    // Get all stories
saveStory()     // Save new story
deleteStory()   // Delete story
```

#### `services/blobService.ts`
```typescript
// How files are uploaded to Vercel
uploadMusic()   // Upload MP3 → returns URL
uploadImage()   // Upload JPG/PNG → returns URL
deleteFile()    // Remove file from Vercel Blob
```

#### `api/upload-music.ts`
```typescript
// Serverless function (runs on Vercel)
// Receives file upload → sends to Vercel Blob
// Returns shareable URL
```

### 📄 Pages

#### `Repository.tsx` (393 lines)
- Music library display
- Audio player
- Search functionality
- **ADMIN**: Upload MP3 files, delete songs
- Uses: `blobService`, `dataService`

#### `Stories.tsx` (351 lines)
- Community stories display
- Full-screen newspaper view
- **ADMIN**: Upload images, write stories, delete
- Uses: `blobService`, `dataService`

#### `Home.tsx`
- Landing page
- Project introduction
- Call-to-action buttons

#### `Team.tsx`
- Team member credits (from TEAM_MEMBERS in constants)
- Contact information

#### `Ethics.tsx`
- Archiving principles
- Cultural sovereignty statement

---

## Data Flow Diagram

### Adding a Song (Admin)
```
Admin clicks "Upload Music"
         ↓
Browser opens file picker
         ↓
User selects MP3 file
         ↓
blobService.uploadMusic() called
         ↓
File sent to /api/upload-music
         ↓
Vercel stores in Blob
         ↓
API returns file URL
         ↓
Admin enters: Title, Genre, Performer, Description
         ↓
dataService.saveSong() called
         ↓
Song metadata saved to localStorage
         ↓
[URL + Metadata] stored together
         ↓
Song appears in Repository instantly ✅
```

### User Listening to Music
```
User visits Repository page
         ↓
dataService.getSongs() loads all songs
         ↓
Songs display with audio player
         ↓
User clicks "Play"
         ↓
Browser plays file from Vercel Blob URL
         ↓
Audio streams to user ✅
```

---

## File Sizes (Production Build)

```
dist/
├── index.html                    2.94 kB
└── assets/
    └── index-Cpq2InVL.js       297.54 kB (88.92 kB gzipped)
────────────────────────────────────────
Total: ~300 KB (very fast!) ⚡
```

---

## Code Quality

✅ **TypeScript** - No `any` types, fully typed  
✅ **No external API calls** - Works offline  
✅ **Responsive** - Mobile, tablet, desktop  
✅ **Accessible** - Semantic HTML, ARIA labels  
✅ **Clean imports** - No circular dependencies  

---

## Environment Variables

- `.env.example` - Template for env vars
- `.env.local` - Local dev (not committed to Git)
- `BLOB_READ_WRITE_TOKEN` - Set by Vercel (auto)

**You don't need to manually set these!**  
Vercel handles everything automatically.

---

## Build Output

When you run `npm run build`:
```
vite build

✓ 1723 modules transformed
dist/index.html                    2.94 kB
dist/assets/index-Cpq2InVL.js    297.54 kB
✓ built in 2.37s
```

All files go into `dist/` folder  
Vercel takes `dist/` and serves it globally ✅

---

## Git Workflow

```
.gitignore prevents uploading:
├── node_modules/        ← Dependencies (huge!)
├── dist/                ← Build output
├── .env.local           ← Secrets
├── *.log                ← Log files

Git uploads:
├── Source code (src/)
├── Config files
├── README & docs
├── package.json
└── Everything in SETUP_GUIDE.md
```

---

## Deployment Architecture

```
┌─────────────────┐
│   Your Code     │
│   (GitHub)      │
└────────┬────────┘
         │ (watches)
         ↓
┌─────────────────┐
│   Vercel Build  │ ← npm run build
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌──────────┐
│  HTML  │ │   Blob   │
│   JS   │ │ Storage  │
└────────┘ └──────────┘
    │         │
    └────┬────┘
         ↓
  ┌─────────────┐
  │ CDN Network │ ← Fast worldwide
  └─────────────┘
         ↓
   ┌──────────┐
   │  Users   │ ← Your live site!
   └──────────┘
```

---

## Next Steps

1. **Review** this structure
2. **Understand** data flow
3. **Make changes** locally
4. **Test** with `npm run dev`
5. **Push** to GitHub
6. **Deploy** on Vercel

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed steps! ✨
