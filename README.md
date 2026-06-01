# Job Application Tracker

Job Application Tracker is a local-first Next.js dashboard for tracking companies, roles, statuses, follow-up dates, notes, and contacts. It uses a SQLite-oriented data layer and can export visible records as CSV.

## Features

- Dashboard summary for pipeline counts and upcoming follow-ups
- Filterable application table
- Contact and notes detail cards
- CSV export for the current view
- SQLite-oriented demo database bootstrap with `sql.js`

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- `sql.js`
- Vitest

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

## Roadmap

See `docs/ROADMAP.md`.

## Release

See `docs/RELEASE_CHECKLIST.md`.

## License

MIT
