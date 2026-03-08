'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AutosaveIndicator } from '@/components/ui/autosave-indicator';
import { useFormDraft } from '@/hooks/use-form-draft';
import { cn } from '@/utils/cn';

export type ServiceFormValues = {
  nome: string;
  valor: string;
  duracaoMinutos: string;
  categoria: string;
  descricao: string;
  availableForBooking: boolean;
  imageUrl?: string;
};

export type ServiceFormModalMode = 'create' | 'edit';

type ServiceFormModalProps = {
  open: boolean;
  mode: ServiceFormModalMode;
  initialValues?: Partial<ServiceFormValues>;
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
};

const initialFormValues: ServiceFormValues = {
  nome: '',
  valor: '',
  duracaoMinutos: '',
  categoria: '',
  descricao: '',
  availableForBooking: true,
  imageUrl: '',
};

function sanitizeValues(initialValues?: Partial<ServiceFormValues>): ServiceFormValues {
  return {
    nome: initialValues?.nome ?? '',
    valor: initialValues?.valor ?? '',
    duracaoMinutos: initialValues?.duracaoMinutos ?? '',
    categoria: initialValues?.categoria ?? '',
    descricao: initialValues?.descricao ?? '',
    availableForBooking: initialValues?.availableForBooking ?? true,
    imageUrl: initialValues?.imageUrl ?? '',
  };
}

function isValidUrl(url: string) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function ServiceFormModal({ open, mode, initialValues, onClose, onSubmit }: ServiceFormModalProps) {
  const [values, setValues] = useState<ServiceFormValues>(initialFormValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormValues, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const sanitizedInitialValues = useMemo(() => sanitizeValues(initialValues), [initialValues]);

  const handleRestoreDraft = useCallback((nextValues: ServiceFormValues) => {
    setValues(nextValues);
  }, []);

  const { clearDraft, draftSavedAt, wasRestored } = useFormDraft({
    draftKey: 'draft-service-form',
    enabled: open,
    values,
    initialValues: sanitizedInitialValues,
    onRestore: handleRestoreDraft,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setErrors({});
    setSubmitError('');
  }, [open]);

  if (!open) {
    return null;
  }

  const title = mode === 'edit' ? 'Editar serviço/procedimento' : 'Novo serviço/procedimento';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof ServiceFormValues, string>> = {};
    const parsedValor = Number(values.valor.replace(',', '.'));
    const parsedDuracao = Number(values.duracaoMinutos);

    if (!values.nome.trim()) {
      nextErrors.nome = 'Informe o nome do serviço.';
    }

    if (!values.categoria.trim()) {
      nextErrors.categoria = 'Informe a categoria.';
    }

    if (!values.valor.trim()) {
      nextErrors.valor = 'Informe o valor.';
    } else if (!Number.isFinite(parsedValor) || parsedValor <= 0) {
      nextErrors.valor = 'Informe um valor válido maior que zero.';
    }

    if (!values.duracaoMinutos.trim()) {
      nextErrors.duracaoMinutos = 'Informe a duração em minutos.';
    } else if (!Number.isFinite(parsedDuracao) || parsedDuracao <= 0) {
      nextErrors.duracaoMinutos = 'Informe uma duração válida.';
    }

    if (values.imageUrl?.trim() && !isValidUrl(values.imageUrl.trim())) {
      nextErrors.imageUrl = 'Informe uma URL válida iniciando com http:// ou https://.';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    const payload = {
      nome: values.nome.trim(),
      categoria: values.categoria.trim(),
      valor: parsedValor.toFixed(2),
      duracaoMinutos: String(parsedDuracao),
      descricao: values.descricao.trim(),
      availableForBooking: values.availableForBooking,
      imageUrl: values.imageUrl?.trim() ?? '',
    };

    setIsSaving(true);
    setSubmitError('');

    try {
      await onSubmit(payload);
      clearDraft();
      onClose();
    } catch {
      setSubmitError('Não foi possível salvar agora. Seu rascunho foi mantido para nova tentativa.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-coffee-blackCoffee/45 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <button type="button" aria-label="Fechar modal" className="absolute inset-0" onClick={onClose} />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-form-modal-title"
        className="relative z-10 flex max-h-[100dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-coffee-cappuccino bg-coffee-cream shadow-elevated sm:max-h-[96dvh] sm:rounded-3xl"
      >
        <header className="border-b border-coffee-cappuccino/75 px-4 pb-4 pt-5 sm:px-7 sm:pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Cadastro de procedimentos</p>
          <h2 id="service-form-modal-title" className="mt-1 text-xl font-semibold text-coffee-darkRoast sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-coffee-espresso/90">Preencha os dados para manter seu catálogo elegante e pronto para agendamentos.</p>
          <AutosaveIndicator savedAt={draftSavedAt} restored={wasRestored} />
        </header>

        <form className="flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-7" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div className="grid gap-3 rounded-2xl border border-coffee-cappuccino/80 bg-white/80 p-4 sm:grid-cols-2 sm:gap-4">
              <Input
                label="Nome *"
                value={values.nome}
                onChange={(event) => setValues((previous) => ({ ...previous, nome: event.target.value }))}
                error={errors.nome}
                placeholder="Ex: Limpeza de pele premium"
                autoComplete="off"
                required
              />
              <Input
                label="Categoria *"
                value={values.categoria}
                onChange={(event) => setValues((previous) => ({ ...previous, categoria: event.target.value }))}
                error={errors.categoria}
                placeholder="Ex: Estética facial"
                autoComplete="off"
                required
              />
              <Input
                label="Valor (R$) *"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={values.valor}
                onChange={(event) => setValues((previous) => ({ ...previous, valor: event.target.value }))}
                error={errors.valor}
                placeholder="0,00"
                required
              />
              <Input
                label="Duração (minutos) *"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={values.duracaoMinutos}
                onChange={(event) => setValues((previous) => ({ ...previous, duracaoMinutos: event.target.value }))}
                error={errors.duracaoMinutos}
                placeholder="60"
                required
              />
            </div>

            <div className="space-y-1.5 rounded-2xl border border-coffee-cappuccino/80 bg-white/80 p-4">
              <label className="text-sm font-medium text-coffee-darkRoast" htmlFor="service-descricao">
                Descrição
              </label>
              <textarea
                id="service-descricao"
                className={cn(
                  'min-h-24 w-full rounded-xl border border-border bg-coffee-latte px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors',
                  'focus:border-coffee-espresso focus:outline-none focus:ring-2 focus:ring-coffee-cappuccino/60',
                )}
                value={values.descricao}
                onChange={(event) => setValues((previous) => ({ ...previous, descricao: event.target.value }))}
                placeholder="Descreva os benefícios e etapas do procedimento."
              />
            </div>

            <div className="grid gap-3 rounded-2xl border border-coffee-cappuccino/80 bg-white/80 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <Input
                label="Imagem (opcional)"
                type="url"
                value={values.imageUrl}
                onChange={(event) => setValues((previous) => ({ ...previous, imageUrl: event.target.value }))}
                error={errors.imageUrl}
                placeholder="https://..."
                helperText="Campo pronto para integrar com upload no Firebase Storage."
              />
              <label className="flex h-11 items-center gap-2 rounded-xl border border-coffee-cappuccino bg-coffee-latte px-3 text-sm font-medium text-coffee-darkRoast">
                <input
                  type="checkbox"
                  checked={values.availableForBooking}
                  onChange={(event) =>
                    setValues((previous) => ({
                      ...previous,
                      availableForBooking: event.target.checked,
                    }))
                  }
                  className="size-4 rounded border-coffee-cappuccino accent-coffee-mocha"
                />
                Disponível para agendamento
              </label>
            </div>
          </div>

          {submitError ? <p className="mt-4 text-sm text-red-700">{submitError}</p> : null}

          <div className="sticky bottom-0 mt-5 flex flex-col-reverse gap-2 border-t border-coffee-cappuccino/70 bg-coffee-cream/95 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="w-full bg-coffee-mocha text-coffee-cream hover:bg-coffee-espresso sm:w-auto">
              {isSaving ? 'Salvando...' : 'Salvar Serviço'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
