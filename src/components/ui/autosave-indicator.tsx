'use client';

type AutosaveIndicatorProps = {
  savedAt: number | null;
  restored?: boolean;
};

function formatSavedAt(savedAt: number) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(savedAt));
}

export function AutosaveIndicator({ savedAt, restored = false }: AutosaveIndicatorProps) {
  if (!savedAt) {
    return <p className="text-xs text-coffee-espresso">{restored ? 'Rascunho recuperado.' : 'Autosave pronto.'}</p>;
  }

  return <p className="text-xs text-coffee-espresso">Rascunho salvo automaticamente às {formatSavedAt(savedAt)}.</p>;
}
