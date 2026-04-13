# Beyond

`beyond/` is the Next.js-first refactor target for the legacy `wowsinfo/` app.

The rule for this folder is simple:

- Shared logic stays headless and framework-agnostic.
- Web is the first production surface.
- Native UI is treated as a consumer of serialized screen payloads, not the owner of business logic.

## Stack

- Bun for package management, scripts, and tests
- Next.js App Router for the web surface
- Tailwind CSS for the web styling layer
- Strict TypeScript for domain, data, and bridge contracts

## Folder intent

- `app/`: Next.js routes and API adapters
- `src/core/`: low-level utilities and HTTP primitives
- `src/domain/`: stable game concepts, config, and API shapes
- `src/features/`: feature modules that compose domain + core
- `src/bridges/native/`: contracts for SwiftUI and Jetpack Compose consumers

## First migrated slice

The first slice ports the legacy `Search` + `Friend` intent from `wowsinfo/src/page/home/` into:

- typed search rules
- typed favorites storage
- a web UI that depends on the shared engine
- player overview, ships, and ship detail routes modeled after the legacy player flow
- native bridge payload types for the same screen

## Route map

- `/search`
- `/player/[server]/[accountId]`
- `/player/[server]/[accountId]/ships`
- `/player/[server]/[accountId]/ships/[shipId]`

## Local setup

1. Create `.env.local` from `.env.example`
2. Set `WOWS_APP_ID`
3. Run `bun install`
4. Run `bun run dev`

## Notes

- The Wargaming app id is kept server-side through Next.js route handlers.
- The current native bridge is contract-first. The Protobuf schema and JSI transport should be generated from the payload contracts once the mobile shell is ready.
