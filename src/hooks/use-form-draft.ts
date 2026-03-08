'use client';

import { useEffect, useRef, useState } from 'react';

type UseFormDraftParams<T> = {
  draftKey: string;
  enabled: boolean;
  values: T;
  initialValues: T;
  onRestore: (nextValues: T) => void;
  debounceMs?: number;
};

type DraftPayload<T> = {
  values: T;
  updatedAt: number;
};

export function useFormDraft<T>({
  draftKey,
  enabled,
  values,
  initialValues,
  onRestore,
  debounceMs = 500,
}: UseFormDraftParams<T>) {
  const initializedRef = useRef(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [wasRestored, setWasRestored] = useState(false);

  useEffect(() => {
    if (!enabled) {
      initializedRef.current = false;
      setWasRestored(false);
      return;
    }

    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const rawValue = window.localStorage.getItem(draftKey);

    if (!rawValue) {
      onRestore(initialValues);
      setLastSavedAt(null);
      return;
    }

    try {
      const payload = JSON.parse(rawValue) as DraftPayload<T>;
      onRestore(payload.values);
      setLastSavedAt(payload.updatedAt ?? Date.now());
      setWasRestored(true);
    } catch {
      onRestore(initialValues);
      setLastSavedAt(null);
    }
  }, [draftKey, enabled, initialValues, onRestore]);

  useEffect(() => {
    if (!enabled || !initializedRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const payload: DraftPayload<T> = {
        values,
        updatedAt: Date.now(),
      };

      window.localStorage.setItem(draftKey, JSON.stringify(payload));
      setLastSavedAt(payload.updatedAt);
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [debounceMs, draftKey, enabled, values]);

  function clearDraft() {
    window.localStorage.removeItem(draftKey);
    setLastSavedAt(null);
    setWasRestored(false);
  }

  return {
    clearDraft,
    draftSavedAt: lastSavedAt,
    wasRestored,
  };
}
