'use client';

import type {FavoritesSnapshot} from '@/domain/wows/models';
import {
  emptyFavoritesSnapshot,
  type FavoritesStore,
} from '@/features/favorites/favorites-store';

const storageKey = 'beyond:favorites';

export class BrowserFavoritesStore implements FavoritesStore {
  load(): FavoritesSnapshot {
    if (typeof window === 'undefined') {
      return emptyFavoritesSnapshot();
    }

    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return emptyFavoritesSnapshot();
    }

    try {
      return JSON.parse(raw) as FavoritesSnapshot;
    } catch {
      return emptyFavoritesSnapshot();
    }
  }

  save(snapshot: FavoritesSnapshot): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
  }
}

