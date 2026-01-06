# Bajau Archives - AI Agent Instructions

## Project Overview
Bajau Archives is a React + TypeScript digital heritage preservation platform for Sama-Bajau maritime culture. It provides a secure song repository and community storytelling features with localStorage-based persistence. Built with Vite, deployed to Vercel.

## Architecture Essentials

### Data Layer & Environment Strategy
- **localStorage persistence**: All data stored in browser via [dataService.ts](services/dataService.ts)
- **Mock data fallback**: [constants.tsx](constants.tsx) provides SONGS_MOCK and STORIES as initial data
- **Access control**: Two auth levels stored in localStorage: `ADMIN_KEY` (full CRUD) and `ACCESS_KEY` (read-only viewer)

### Component Structure
- **Pages** (React Router v7 with HashRouter): Home, Team, Repository, Stories, Ethics
- **Shared Components**: Navbar (with brand styling), ScrollToTop, embedded in [App.tsx](App.tsx) layout with flex-based footer
- **State Management**: Local React hooks; no Redux/Context. Repository page is the heaviest at 393 lines with complex audio playback and form states

### Service Boundaries
- **[dataService.ts](services/dataService.ts)**: CRUD operations for songs/stories using localStorage
- **Song interface** ([types.ts](types.ts)): Core entity with optional audioUrl; CommunityStory contains full content + image; TeamMember for credits

## Critical Workflows

### Local Development
```
npm run dev      # Vite dev server on :3000
npm run build    # Production build to dist/
npm run preview  # Preview built assets
```
No environment variables required—all data is stored locally.

## Code Patterns & Conventions

### TypeScript Patterns
- **Import aliases**: `@` maps to project root in [vite.config.ts](vite.config.ts#L17)
- **React.FC typing**: Standard for all component signatures
- **No .d.ts files**: Types declared inline or in [types.ts](types.ts)

### Styling
- **Tailwind CSS only**; no CSS modules or styled-components
- **Color scheme**: Slate/dark with teal accents (e.g., `text-teal-500`, `bg-slate-950`)
- **Responsive**: Mobile-first with `md:` breakpoints for desktop

### Data Access Patterns
1. **Repository page**: Uses localStorage key `bajau_access_role` for session persistence
2. **Song management**: `dataService.getSongs()` returns localStorage data or `SONGS_MOCK` from [constants.tsx](constants.tsx)
3. **Add features**: Import Song interface from [types.ts](types.ts); extend dataService with new methods

### Error Handling
- Form validation via state checks in component render
- localStorage errors logged to console; no crashes

## Decolonial & Ethical Constraints
This archive prioritizes **cultural sovereignty**. When modifying:
- Avoid hardcoding community member data; reference [constants.tsx](constants.tsx) TEAM_MEMBERS
- Ethics.tsx page explains archiving protocols; keep visible in footer/navigation

## Integration Points
- **localStorage API**: All data persisted to browser storage
- **Vercel deployment**: Static site deployment; no backend required

## Common Tasks

| Task | Where | Pattern |
|------|-------|---------|
| Add song field | [types.ts](types.ts) Song interface + [constants.tsx](constants.tsx) mock data | Extend interface, update SONGS_MOCK |
| New page | Create in `pages/`, import in [App.tsx](App.tsx) routes, add Navbar link | React component + Router route |
| Debug data | Check browser DevTools localStorage tab or [dataService.ts](services/dataService.ts) methods | Inspect `bajau_songs` and `bajau_stories` keys |
