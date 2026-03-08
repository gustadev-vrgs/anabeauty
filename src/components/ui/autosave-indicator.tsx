'use client';

import { useEffect, useMemo, useState } from 'react';

type AutosaveIndicatorProps = {
  savedAt: number | null;
  restored?: boolean;
};

function formatAgo(savedAt: number) {
  const deltaSeconds = Math.max(0, Math.floor((Date.now() - savedAt) / 1000));

  if (deltaSeconds < 5) {
    return 'agora';
  }

  if (deltaSeconds < 60) {
    return `há ${deltaSeconds}s`;
  }

  const minutes = Math.floor(deltaSeconds / 60);
  return `há ${minutes}min`;
}

export function AutosaveIndicator({ savedAt, restored = false }: AutosaveIndicatorProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!savedAt) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTick((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [savedAt]);

  const label = useMemo(() => {
    if (!savedAt) {
      return restored ? 'Rascunho recuperado.' : 'Autosave pronto.';
    }

    return `Rascunho salvo automaticamente (${formatAgo(savedAt)}).`;
  }, [restored, savedAt]);

  return <p className="text-xs text-coffee-espresso">{label}</p>;
}
