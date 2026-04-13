'use client';

import {useEffect, useMemo, useState} from 'react';
import type {FavoritesSnapshot} from '@/domain/wows/models';
import type {FavoriteEntity} from '@/features/favorites/favorite-entity';
import {
  addFavorite,
  emptyFavoritesSnapshot,
  removeFavorite,
} from '@/features/favorites/favorites-store';
import {BrowserFavoritesStore} from './browser-favorites-store';

export function useFavorites() {
  const store = useMemo(() => new BrowserFavoritesStore(), []);
  const [snapshot, setSnapshot] = useState<FavoritesSnapshot>(emptyFavoritesSnapshot());

  useEffect(() => {
    setSnapshot(store.load());
  }, [store]);

  return {
    favorites: snapshot,
    add(entity: FavoriteEntity) {
      setSnapshot((current) => {
        const nextSnapshot = addFavorite(current, entity);
        store.save(nextSnapshot);
        return nextSnapshot;
      });
    },
    remove(entity: FavoriteEntity) {
      setSnapshot((current) => {
        const nextSnapshot = removeFavorite(current, entity);
        store.save(nextSnapshot);
        return nextSnapshot;
      });
    },
  };
}
