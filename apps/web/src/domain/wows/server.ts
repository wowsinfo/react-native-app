import type {ServerId} from './models';

export type ServerDefinition = {
  id: ServerId;
  name: string;
  apiDomain: string;
  prefix: string;
};

const servers: Record<ServerId, ServerDefinition> = {
  ru: {
    id: 'ru',
    name: 'Russia',
    apiDomain: 'ru',
    prefix: 'ru',
  },
  eu: {
    id: 'eu',
    name: 'Europe',
    apiDomain: 'eu',
    prefix: 'eu',
  },
  na: {
    id: 'na',
    name: 'North America',
    apiDomain: 'com',
    prefix: 'na',
  },
  asia: {
    id: 'asia',
    name: 'Asia',
    apiDomain: 'asia',
    prefix: 'asia',
  },
};

export function listServerDefinitions(): ServerDefinition[] {
  return Object.values(servers);
}

export function getServerDefinition(value: string): ServerDefinition {
  if (isServerId(value)) {
    return servers[value];
  }

  throw new Error(`Unsupported server "${value}".`);
}

function isServerId(value: string): value is ServerId {
  return value === 'ru' || value === 'eu' || value === 'na' || value === 'asia';
}

