export type MigrationPhase = {
  title: string;
  summary: string;
  status: 'done' | 'next' | 'blocked';
};

export const migrationPhases: MigrationPhase[] = [
  {
    title: 'Expo SDK 55 Scaffold',
    summary: 'Fresh Expo Router app created under next/ with Bun and typed routes.',
    status: 'done',
  },
  {
    title: 'Shared App Foundation',
    summary:
      'Move app constants, localization, storage, and API clients into Expo-safe modules.',
    status: 'next',
  },
  {
    title: 'Navigation Rewrite',
    summary:
      'Replace react-native-router-flux scenes with file-based Expo Router routes.',
    status: 'next',
  },
  {
    title: 'Native Feature Rebuild',
    summary:
      'Reintroduce only the native features that still matter using Expo modules or config plugins.',
    status: 'blocked',
  },
];
