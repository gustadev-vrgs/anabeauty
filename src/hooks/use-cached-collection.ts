'use client';

import { useCallback, useEffect, useState } from 'react';

const collectionCache = new Map<string, unknown[]>();

type UseCachedCollectionParams<T> = {
  cacheKey: string;
  loader: () => Promise<T[]>;
  fallbackData?: T[];
};

export function useCachedCollection<T>({ cacheKey, loader, fallbackData = [] }: UseCachedCollectionParams<T>) {
  const [data, setData] = useState<T[]>(() => (collectionCache.get(cacheKey) as T[] | undefined) ?? fallbackData);
  const [loading, setLoading] = useState(!collectionCache.has(cacheKey));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const result = await loader();
      collectionCache.set(cacheKey, result);
      setData(result);
      setError(null);
    } catch {
      if (!collectionCache.has(cacheKey)) {
        setData(fallbackData);
      }

      setError('Não foi possível carregar dados agora. Exibindo conteúdo local.');
    } finally {
      setLoading(false);
    }
  }, [cacheKey, fallbackData, loader]);

  useEffect(() => {
    if (collectionCache.has(cacheKey)) {
      return;
    }

    void load();
  }, [cacheKey, load]);

  const updateCache = useCallback(
    (updater: (previous: T[]) => T[]) => {
      setData((previous) => {
        const next = updater(previous);
        collectionCache.set(cacheKey, next);
        return next;
      });
    },
    [cacheKey],
  );

  return { data, error, loading, reload: load, updateCache };
}
