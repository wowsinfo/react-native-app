# Beyond Architecture

## Why this exists

The legacy `wowsinfo/` app is feature-rich, but the responsibilities are tangled:

- page components make transport decisions
- mutable global state leaks across features
- storage, navigation, and rendering are coupled to React Native

That makes a Next.js-first web surface and future native UI bridge harder than it needs to be.

## Refactor shape

`beyond/` is built around a narrow flow:

1. `domain/` defines stable game concepts and API contracts.
2. `core/` provides low-level utilities such as template formatting and HTTP.
3. `features/` compose business rules into headless use cases.
4. `app/` adapts those use cases to the web.
5. `bridges/native/` exposes serializable payloads for SwiftUI and Compose.

## Current migrated slice

The first migrated slice is the search experience.

Legacy source:

- `wowsinfo/src/page/home/Search.js`
- `wowsinfo/src/page/home/Friend.js`
- `wowsinfo/src/value/api.ts`
- `wowsinfo/src/value/data.ts`

New shape:

- `src/domain/wows/server.ts`: region mapping and stable ids
- `src/domain/wows/wows-api-client.ts`: typed Wargaming client
- `src/features/search/search-engine.ts`: query rules and orchestration
- `src/features/favorites/`: storage-independent favorites behavior
- `src/features/search/web/`: the web surface
- `src/bridges/native/screen-contracts.ts`: serialized screen payloads

## Native bridge intent

The web surface is not the architecture center.

The center is the payload contract. Once the mobile shell exists:

- TypeScript computes `NativeBridgeEnvelope`
- JSI transports bytes to native code
- Protobuf becomes the wire format for those payloads
- SwiftUI and Compose render native views from the same payload shape

That keeps navigation and rendering native while business logic stays shared.

