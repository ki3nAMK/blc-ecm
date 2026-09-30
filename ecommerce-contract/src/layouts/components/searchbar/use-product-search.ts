import type { IProductItem } from '@/types/product';

import { get } from 'lodash';
import { useMemo } from 'react';
import { useProducts } from '@/states/products';

// ----------------------------------------------------------------------

const BEST_SELLERS_LIMIT = 5;

export function useProductSearchResults(query: string) {
  const { products, loading } = useProducts();
  const items = get(products, 'data', []) as IProductItem[];

  // Before the user types anything, suggest what's actually selling instead of an empty
  // dialog — ranked by real totalSold, not a placeholder list.
  const bestSellers = useMemo(
    () => [...items].sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0)).slice(0, BEST_SELLERS_LIMIT),
    [items]
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return items
      .filter((product) => {
        const haystack = [product.name, product.category, ...(product.tags || [])]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 20);
  }, [items, query]);

  const isSuggestion = !query.trim();

  return { results: isSuggestion ? bestSellers : searchResults, isSuggestion, loading };
}
