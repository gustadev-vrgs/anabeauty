'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AutosaveIndicator } from '@/components/ui/autosave-indicator';
import { useFormDraft } from '@/hooks/use-form-draft';
import { formatPhone, isValidPhoneFormat, normalizeInstagram } from '@/lib/clients/fields';

export type ClientFormValues = {
  name: string;
  phone: string;
  email: string;
  instagram: string;
  notes: string;
  address: string;
  birthDate: string;
};

export type ClientFormModalMode = 'create' | 'edit';

type ClientFormModalProps = {
  open: boolean;
  mode: ClientFormModalMode;
  initialValues?: Partial<ClientFormValues>;
  onClose: () => void;
  onSubmit: (values: ClientFormValues) => Promise<void>;
};

const DEFAULT_TEXT_MAX_LENGTH = 255;
const TEXTAREA_MAX_LENGTH = 1000;

const initialFormValues: ClientFormValues = {
  name: '',
  phone: '',
  email: '',
  instagram: '',
  notes: '',
  address: '',
  birthDate: '',
};

function sanitizeValues(initialValues?: Partial<ClientFormValues>): ClientFormValues {
  return {
    name: initialValues?.name ?? '',
    phone: formatPhone(initialValues?.phone ?? ''),
    email: initialValues?.email ?? '',
    instagram: normalizeInstagram(initialValues?.instagram ?? ''),
    notes: initialValues?.notes ?? '',
    address: initialValues?.address ?? '',
    birthDate: initialValues?.birthDate ?? '',
  };
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ClientFormModal({ open, mode, initialValues, onClose, onSubmit }: ClientFormModalProps) {
  const [values, setValues] = useState<ClientFormValues>(initialFormValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormValues, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showContactExtras, setShowContactExtras] = useState(true);
  const [showProfileExtras, setShowProfileExtras] = useState(false);

  const title = mode === 'edit' ? 'Editar cliente' : 'Novo cliente';

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

  const handleRestoreDraft = useCallback((nextValues: ClientFormValues) => {
    setValues(nextValues);
  }, []);

  const { clearDraft, draftSavedAt, wasRestored } = useFormDraft({
    draftKey: 'draft-client-form',
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
    setShowContactExtras(true);
    setShowProfileExtras(mode === 'edit');
  }, [open, mode]);

  const hasAnyOptionalValue = useMemo(
    () => Boolean(values.email || values.instagram || values.notes || values.address || values.birthDate),
    [values],
  );

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof ClientFormValues, string>> = {};
    if (!values.name.trim()) {
      nextErrors.name = 'Informe o nome da cliente.';
    }

    if (!values.phone.trim()) {
      nextErrors.phone = 'Informe o telefone da cliente.';
    } else if (!isValidPhoneFormat(values.phone)) {
      nextErrors.phone = 'Informe um telefone válido no formato (99) 99999-9999';
    }

    if (values.email.trim() && !validateEmail(values.email.trim())) {
      nextErrors.email = 'Informe um email válido.';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      instagram: normalizeInstagram(values.instagram),
      notes: values.notes.trim(),
      address: values.address.trim(),
      birthDate: values.birthDate,
    };

    setIsSaving(true);
    setSubmitError('');

    try {
      await onSubmit(payload);
      clearDraft();
      onClose();
    } catch {
      setSubmitError('Não foi possível salvar agora. Seu rascunho continua seguro para nova tentativa.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-coffee-blackCoffee/55 px-0 py-0 backdrop-blur-[2px] sm:items-center sm:px-4 sm:py-8">
      <button type="button" aria-label="Fechar modal" className="absolute inset-0" onClick={onClose} />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-form-modal-title"
        className="relative z-10 max-h-[100dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-[1.75rem] border border-coffee-cappuccino/80 bg-white p-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] shadow-[0_24px_60px_rgba(36,27,20,0.2)] sm:max-h-[88vh] sm:rounded-[1.75rem] sm:p-7"
      >
        <header className="mb-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Clientes</p>
          <h2 id="client-form-modal-title" className="text-xl font-semibold text-coffee-darkRoast sm:text-2xl">
            {title}
          </h2>
          <p className="text-sm text-coffee-espresso">
            Preencha os dados da cliente.
          </p>
          <AutosaveIndicator savedAt={draftSavedAt} restored={wasRestored} />
        </header>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="rounded-2xl border border-coffee-cappuccino/80 bg-white p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-coffee-espresso">Obrigatório</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Nome *"
                value={values.name}
                onChange={(event) => setValues((previous) => ({ ...previous, name: event.target.value }))}
                error={errors.name}
                placeholder="Ex: Maria Silva"
                autoComplete="name"
                required
              />
              <Input
                label="Telefone *"
                value={values.phone}
                onChange={(event) =>
                  setValues((previous) => ({
                    ...previous,
                    phone: formatPhone(event.target.value),
                  }))
                }
                error={errors.phone}
                placeholder="(00) 00000-0000"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={15}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowContactExtras((previous) => !previous)}
              className="flex w-full items-center justify-between rounded-2xl border border-coffee-cappuccino/80 bg-white px-4 py-3 text-left"
              aria-expanded={showContactExtras}
            >
              <span>
                <p className="text-sm font-semibold text-coffee-darkRoast">Contato adicional</p>
                <p className="text-xs text-coffee-espresso">Email e Instagram</p>
              </span>
              <span className="text-sm font-semibold text-coffee-mocha">{showContactExtras ? 'Recolher' : 'Expandir'}</span>
            </button>

            {showContactExtras ? (
              <div className="grid gap-3 rounded-2xl border border-coffee-cappuccino/80 bg-white p-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={(event) => setValues((previous) => ({ ...previous, email: event.target.value }))}
                  error={errors.email}
                  placeholder="cliente@email.com"
                  autoComplete="email"
                  inputMode="email"
                />
                <Input
                  label="Instagram"
                  value={values.instagram}
                  onChange={(event) =>
                    setValues((previous) => ({
                      ...previous,
                      instagram: normalizeInstagram(event.target.value),
                    }))
                  }
                  placeholder="@cliente"
                  autoCapitalize="none"
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowProfileExtras((previous) => !previous)}
              className="flex w-full items-center justify-between rounded-2xl border border-coffee-cappuccino/80 bg-white px-4 py-3 text-left"
              aria-expanded={showProfileExtras}
            >
              <span>
                <p className="text-sm font-semibold text-coffee-darkRoast">Perfil e observações</p>
                <p className="text-xs text-coffee-espresso">Data de nascimento, endereço e observações</p>
              </span>
              <span className="text-sm font-semibold text-coffee-mocha">{showProfileExtras ? 'Recolher' : 'Expandir'}</span>
            </button>

            {showProfileExtras ? (
              <div className="space-y-3 rounded-2xl border border-coffee-cappuccino/80 bg-white p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Data de nascimento"
                    type="date"
                    value={values.birthDate}
                    onChange={(event) => setValues((previous) => ({ ...previous, birthDate: event.target.value }))}
                  />
                  <Input
                    label="Endereço"
                    value={values.address}
                    onChange={(event) => setValues((previous) => ({ ...previous, address: event.target.value }))}
                    placeholder="Rua, número, cidade"
                    autoComplete="street-address"
                    maxLength={DEFAULT_TEXT_MAX_LENGTH}
                  />
                </div>
                <Textarea
                  id="observacoes-cliente"
                  label="Observações"
                  value={values.notes}
                  onChange={(event) => setValues((previous) => ({ ...previous, notes: event.target.value }))}
                  placeholder="Digite observações do atendimento"
                  maxLength={TEXTAREA_MAX_LENGTH}
                />
              </div>
            ) : null}
          </div>

          {!hasAnyOptionalValue ? (
            <p className="text-xs text-coffee-espresso">Preencha nome e telefone para continuar.</p>
          ) : null}

          {submitError ? <p className="text-sm text-red-700">{submitError}</p> : null}

          <div className="flex flex-col-reverse gap-2 border-t border-coffee-cappuccino/70 pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-coffee-mocha text-coffee-cream hover:bg-coffee-espresso sm:w-auto"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
