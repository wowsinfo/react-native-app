import type {FavoritesSnapshot} from '@/domain/wows/models';
import type {FavoriteEntity} from './favorite-entity';

export interface FavoritesStore {
  load(): FavoritesSnapshot;
  save(snapshot: FavoritesSnapshot): void;
}

export function addFavorite(snapshot: FavoritesSnapshot, entity: FavoriteEntity): FavoritesSnapshot {
  if (entity.kind === 'player') {
    const players = snapshot.players.filter((item) => item.accountId !== entity.value.accountId);

    return {
      ...snapshot,
      players: [entity.value, ...players],
    };
  }

  const clans = snapshot.clans.filter((item) => item.clanId !== entity.value.clanId);

  return {
    ...snapshot,
    clans: [entity.value, ...clans],
  };
}

export function removeFavorite(
  snapshot: FavoritesSnapshot,
  entity: FavoriteEntity,
): FavoritesSnapshot {
  if (entity.kind === 'player') {
    return {
      ...snapshot,
      players: snapshot.players.filter((item) => item.accountId !== entity.value.accountId),
    };
  }

  return {
    ...snapshot,
    clans: snapshot.clans.filter((item) => item.clanId !== entity.value.clanId),
  };
}

export function emptyFavoritesSnapshot(): FavoritesSnapshot {
  return {
    players: [],
    clans: [],
  };
}

