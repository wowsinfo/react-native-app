import type {FavoriteClan, FavoritePlayer} from '@/domain/wows/models';

export type FavoriteEntity =
  | {
      kind: 'player';
      value: FavoritePlayer;
    }
  | {
      kind: 'clan';
      value: FavoriteClan;
    };

