# WoWs Info Next

Expo-first rewrite of the legacy WoWs Info app. This app targets Expo SDK 55, Expo Router, Bun, and web support.

## Setup

Install dependencies:

```powershell
bun install
```

Configure the World of Warships API key in the local env file:

```powershell
EXPO_PUBLIC_WOWS_APP_KEY=replace-with-your-wargaming-application-id
```

The project includes:

- [`.env.example`](/C:/Users/nateq/Documents/GitHub/react-native-app/next/.env.example) as the committed template
- [`.env`](/C:/Users/nateq/Documents/GitHub/react-native-app/next/.env) as the local runtime file used by Expo

`EXPO_PUBLIC_WOWS_APP_KEY` is required for the migrated search, player, and clan routes.

## Run

```powershell
bun run start
bun run web
bun run android
bun run ios
bunx tsc --noEmit
```

## Current Scope

- Home and Settings are migrated into Expo Router
- Search, player, ship, rank, graph, and clan routes now exist in Expo Router
- Some legacy data-rich screens still need encyclopedia/cache migration for full parity
