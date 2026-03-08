'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

export type ServiceFormValues = {
  name: string;
  price: string;
  durationMinutes: string;
  category: string;
  description: string;
  availableForBooking: boolean;
  imageUrl: string;
};

export type ServiceFormModalMode = 'create' | 'edit';

type ServiceFormModalProps = {
  open: boolean;
  mode: ServiceFormModalMode;
  initialValues?: Partial<ServiceFormValues>;
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => void;
};

const initialFormValues: ServiceFormValues = {
  name: '',
  price: '',
  durationMinutes: '',
  category: '',
  description: '',
  availableForBooking: true,
  imageUrl: '',
};

function sanitizeValues(initialValues?: Partial<ServiceFormValues>): ServiceFormValues {
  return {
    name: initialValues?.name ?? '',
    price: initialValues?.price ?? '',
    durationMinutes: initialValues?.durationMinutes ?? '',
    category: initialValues?.category ?? '',
    description: initialValues?.description ?? '',
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

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(sanitizeValues(initialValues));
    setErrors({});
  }, [open, initialValues]);

  if (!open) {
    return null;
  }

  const title = mode === 'edit' ? 'Editar serviço' : 'Novo serviço';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof ServiceFormValues, string>> = {};
    const parsedPrice = Number(values.price.replace(',', '.'));
    const parsedDuration = Number(values.durationMinutes);

    if (!values.name.trim()) {
      nextErrors.name = 'Informe o nome do serviço.';
    }

    if (!values.category.trim()) {
      nextErrors.category = 'Informe a categoria.';
    }

    if (!values.price.trim()) {
      nextErrors.price = 'Informe o valor.';
    } else if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      nextErrors.price = 'Informe um valor válido.';
    }

    if (!values.durationMinutes.trim()) {
      nextErrors.durationMinutes = 'Informe a duração em minutos.';
    } else if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      nextErrors.durationMinutes = 'Informe uma duração válida.';
    }

    if (values.imageUrl.trim() && !isValidUrl(values.imageUrl.trim())) {
      nextErrors.imageUrl = 'Informe uma URL válida iniciando com http:// ou https://.';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    onSubmit({
      name: values.name.trim(),
      category: values.category.trim(),
      price: parsedPrice.toFixed(2),
      durationMinutes: String(parsedDuration),
      description: values.description.trim(),
      availableForBooking: values.availableForBooking,
      imageUrl: values.imageUrl.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-coffee-blackCoffee/40 px-3 py-2 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8">
      <button type="button" aria-label="Fechar modal" className="absolute inset-0" onClick={onClose} />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-form-modal-title"
        className="relative z-10 max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-coffee-cappuccino bg-coffee-cream p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-elevated sm:max-h-[88vh] sm:p-6"
      >
        <header className="mb-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Catálogo de procedimentos</p>
          <h2 id="service-form-modal-title" className="text-xl font-semibold text-coffee-darkRoast sm:text-2xl">
            {title}
          </h2>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-3 rounded-2xl border border-coffee-cappuccino/80 bg-white/80 p-4 sm:grid-cols-2">
            <Input
              label="Nome *"
              value={values.name}
              onChange={(event) => setValues((previous) => ({ ...previous, name: event.target.value }))}
              error={errors.name}
              placeholder="Ex: Limpeza de pele"
              required
            />
            <Input
              label="Categoria *"
              value={values.category}
              onChange={(event) => setValues((previous) => ({ ...previous, category: event.target.value }))}
              error={errors.category}
              placeholder="Ex: Estética facial"
              required
            />
            <Input
              label="Valor (R$) *"
              type="number"
              min="0"
              step="0.01"
              value={values.price}
              onChange={(event) => setValues((previous) => ({ ...previous, price: event.target.value }))}
              error={errors.price}
              placeholder="0,00"
              required
            />
            <Input
              label="Duração (minutos) *"
              type="number"
              min="1"
              step="1"
              value={values.durationMinutes}
              onChange={(event) => setValues((previous) => ({ ...previous, durationMinutes: event.target.value }))}
              error={errors.durationMinutes}
              placeholder="60"
              required
            />
          </div>

          <div className="space-y-1.5 rounded-2xl border border-coffee-cappuccino/80 bg-white/80 p-4">
            <label className="text-sm font-medium text-coffee-darkRoast" htmlFor="service-description">
              Descrição
            </label>
            <textarea
              id="service-description"
              className={cn(
                'min-h-24 w-full rounded-xl border border-border bg-coffee-latte px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors',
                'focus:border-coffee-espresso focus:outline-none focus:ring-2 focus:ring-coffee-cappuccino/60',
              )}
              value={values.description}
              onChange={(event) => setValues((previous) => ({ ...previous, description: event.target.value }))}
              placeholder="Descreva os detalhes do procedimento."
            />
          </div>

          <div className="grid gap-3 rounded-2xl border border-coffee-cappuccino/80 bg-white/80 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <Input
              label="URL da imagem (opcional)"
              type="url"
              value={values.imageUrl}
              onChange={(event) => setValues((previous) => ({ ...previous, imageUrl: event.target.value }))}
              error={errors.imageUrl}
              placeholder="https://..."
            />
            <label className="flex h-11 items-center gap-2 rounded-xl border border-coffee-cappuccino bg-coffee-latte px-3 text-sm text-coffee-darkRoast">
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

          <div className="flex flex-col-reverse gap-2 border-t border-coffee-cappuccino/70 pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full bg-coffee-mocha text-coffee-cream hover:bg-coffee-espresso sm:w-auto">
              Salvar Serviço
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
