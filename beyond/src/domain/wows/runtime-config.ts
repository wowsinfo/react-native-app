export type ServerRuntimeConfig = {
  appId: string;
};

export function createServerRuntimeConfig(): ServerRuntimeConfig {
  const appId = process.env.WOWS_APP_ID;

  if (!appId) {
    throw new Error('Missing WOWS_APP_ID. Create beyond/.env.local first.');
  }

  return {appId};
}

