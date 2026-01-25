# Bullet Journal PWA

A minimalist Bullet Journal web app built with React, TypeScript, and IndexedDB. Features a Reeder-inspired aesthetic with full offline support.

## Features

### Core Bullet Journal
- **Daily Log** - Track tasks, events, and notes by date
- **Monthly Log** - Calendar view with entry indicators
- **Future Log** - Plan ahead with 6-month overview
- **Collections** - Create custom lists and projects
- **Index** - Search all entries and navigate collections

### Entry Types
- **Tasks** (•) - With states: incomplete, complete (×), migrated (>), scheduled (<)
- **Events** (○) - Date-specific occurrences
- **Notes** (-) - General information

### Signifiers
- **Priority** (*) - Important items
- **Inspiration** (!) - Ideas to explore

### UX Enhancements
- **Keyboard Shortcuts**
  - `1` / `2` / `3` - Navigate to Daily / Monthly / Future Log
  - `Ctrl+N` - Focus new entry input
  - `Ctrl+E` - Edit first entry
  - `Escape` - Close modals / cancel edit

- **Drag & Drop** - Reorder entries within a day or collection
- **Migration** - Move incomplete tasks to future dates
- **Undo Delete** - 5-second window to restore deleted entries
- **Mobile Swipe** - Swipe left/right to change days
- **Toast Notifications** - Feedback for user actions

### Technical
- **PWA** - Installable with offline support
- **IndexedDB** - Local-first data storage via Dexie
- **Dark Mode** - System preference detection with manual toggle
- **Responsive** - Works on desktop and mobile

## Tech Stack

- React 19
- TypeScript
- Vite
- Dexie (IndexedDB)
- CSS Modules
- @dnd-kit (drag and drop)
- Vitest (testing)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```
src/
├── components/
│   ├── entry/        # Entry components (EntryItem, EntryInput, etc.)
│   ├── layout/       # Layout, Sidebar, BottomNav
│   └── ui/           # Toast notifications, PWA prompt
├── context/          # React Context (Theme, Toast)
├── db/               # Database schema and models
├── hooks/            # Custom hooks (useEntries, useKeyboardShortcuts, etc.)
├── pages/            # Page components
└── styles/           # Global styles and design tokens
```

## License

MIT
