<div align="center">
<h1>WoWs Info Monorepo</h1>
</div>

Workspace layout:

- `apps/web`: Next.js web app
- `apps/expo`: React Native app
- `packages/core`: pure TypeScript shared logic
- `packages/ui`: shared UI scaffold for cross-platform primitives

## Running

- `bun install`
- `bun run dev`
- `bun run dev:web`
- `bun run dev:expo`

The workspace is set up for Bun and Turborepo so common logic can move into `packages/` without duplicating it across the two apps.
