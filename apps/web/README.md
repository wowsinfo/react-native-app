# Web

This is the Next.js app inside the Bun/Turborepo workspace.

Run it from the repo root:

- `bun install`
- `bun run dev:web`

Layout:

- `app/`: Next.js routes and API handlers
- `src/core/`: thin wrappers over `packages/core`
- `src/domain/`: web-specific game logic and data contracts
- `src/features/`: feature modules for search, player, and favorites
- `src/bridges/native/`: serializable payloads for native consumers
