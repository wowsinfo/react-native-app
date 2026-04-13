import type {
  FavoritesSnapshot,
  NativeRoutePayload,
  SearchSnapshot,
  ServerId,
} from '@/domain/wows/models';

export type NativeRoute = NativeRoutePayload['route'];

export type NativeBridgeEnvelope = {
  route: NativeRoute;
  version: 1;
  payload: NativeRoutePayload;
};

export type SearchBridgeFactoryInput = {
  server: ServerId;
  query: string;
  onlineCount: number | null;
  favorites: FavoritesSnapshot;
  result: SearchSnapshot;
};

export function createSearchBridgeEnvelope(
  input: SearchBridgeFactoryInput,
): NativeBridgeEnvelope {
  return {
    route: 'search.home',
    version: 1,
    payload: {
      route: 'search.home',
      server: input.server,
      query: input.query,
      onlineCount: input.onlineCount,
      favorites: input.favorites,
      result: input.result,
    },
  };
}

