'use client';

import type { ReactNode } from 'react';

import { isNil } from 'lodash';
import { useMemo, useState, useContext, createContext } from 'react';

import { STORAGE_FAVORITES } from '@/lib/constants';
import { toast } from 'src/components/snackbar';
import { getStorage, setStorage } from 'src/hooks/use-local-storage';

/* ===================== TYPE ===================== */
interface IFavoritesContext {
  favoriteIds: string[];
  favoriteCount: number;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
}

const favoritesContext = createContext<IFavoritesContext | null>(null);

/* ===================== PROVIDER ===================== */
// Client-only, localStorage-backed — no backend entity for favorites exists (or was asked
// for), so this is scoped to "remember what this browser favorited," same trust level as
// any other local UI preference. Shared via context (not a plain hook) so the header badge
// and every product card/detail page stay in sync with a single source of truth.
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getStorage(STORAGE_FAVORITES) || []);

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      setStorage(STORAGE_FAVORITES, next);
      toast.success(prev.includes(productId) ? 'Removed from favorites' : 'Added to favorites');
      return next;
    });
  };

  const favoriteCount = favoriteIds.length;

  const value = useMemo(
    () => ({ favoriteIds, favoriteCount, isFavorite, toggleFavorite }),
    [favoriteIds, favoriteCount]
  );

  return <favoritesContext.Provider value={value}>{children}</favoritesContext.Provider>;
};

/* ===================== HOOK ===================== */
export const useFavorites = () => {
  const context = useContext(favoritesContext);

  if (isNil(context)) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
};
