'use client';

import type { ReactNode } from 'react';

import { isNil } from 'lodash';
import { useMemo, useState, useContext, createContext } from 'react';

import { STORAGE_COMPARE } from '@/lib/constants';
import { toast } from 'src/components/snackbar';
import { getStorage, setStorage } from 'src/hooks/use-local-storage';

/* ===================== TYPE ===================== */
const MAX_COMPARE = 4;

interface ICompareContext {
  compareIds: string[];
  compareCount: number;
  maxCompare: number;
  isComparing: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
}

const compareContext = createContext<ICompareContext | null>(null);

/* ===================== PROVIDER ===================== */
// Same client-only/localStorage rationale as FavoritesProvider — shared via context so the
// floating compare bar (mounted once in the dashboard layout) and every "Compare" toggle
// button across the app read/write the same list.
export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareIds, setCompareIds] = useState<string[]>(() => getStorage(STORAGE_COMPARE) || []);

  const isComparing = (productId: string) => compareIds.includes(productId);

  const toggleCompare = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        const next = prev.filter((id) => id !== productId);
        setStorage(STORAGE_COMPARE, next);
        toast.success('Removed from compare');
        return next;
      }

      if (prev.length >= MAX_COMPARE) {
        toast.error(`You can compare up to ${MAX_COMPARE} products`);
        return prev;
      }

      const next = [...prev, productId];
      setStorage(STORAGE_COMPARE, next);
      toast.success(`Added to compare (${next.length}/${MAX_COMPARE})`);
      return next;
    });
  };

  const clearCompare = () => {
    setStorage(STORAGE_COMPARE, []);
    setCompareIds([]);
  };

  const compareCount = compareIds.length;

  const value = useMemo(
    () => ({
      compareIds,
      compareCount,
      maxCompare: MAX_COMPARE,
      isComparing,
      toggleCompare,
      clearCompare,
    }),
    [compareIds, compareCount]
  );

  return <compareContext.Provider value={value}>{children}</compareContext.Provider>;
};

/* ===================== HOOK ===================== */
export const useCompare = () => {
  const context = useContext(compareContext);

  if (isNil(context)) {
    throw new Error('useCompare must be used within a CompareProvider');
  }

  return context;
};
