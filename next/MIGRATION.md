# WoWs Info Next Migration

## Goal

`next/` is the Expo-first replacement for the legacy React Native app in
`wowsinfo/`.

The migration order is:

1. Move Expo-safe shared modules first.
2. Rebuild navigation with Expo Router.
3. Port screens one route at a time.
4. Reintroduce native-only features only if they still matter.

## First Modules To Move

- `wowsinfo/src/value/data.ts`
- `wowsinfo/src/value/lang.ts`
- `wowsinfo/src/core/util/SafeStorage.ts`
- `wowsinfo/src/value/api.ts`

## Rules

- Do not import from `wowsinfo/` at runtime.
- Prefer new Expo-safe modules over wrappers around legacy native modules.
- Keep routes file-based and shallow.
- Delete template/demo code as soon as it stops helping the migration.
