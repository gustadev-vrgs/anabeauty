'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formFieldInputClass } from '@/components/ui/form-field';
import { cn } from '@/utils/cn';
import { AutosaveIndicator } from '@/components/ui/autosave-indicator';
import { useFormDraft } from '@/hooks/use-form-draft';
import type {
  AppointmentClient,
  AppointmentConflict,
  AppointmentFormValues,
  AppointmentService,
} from '@/components/agenda/appointment-form-types';

type AppointmentFormModalProps = {
  open: boolean;
  onClose: () => void;
  clients: AppointmentClient[];
  services: AppointmentService[];
  existingConflicts: AppointmentConflict[];
  initialDate: string;
  initialStartTime?: string;
  onSubmit: (values: AppointmentFormValues) => Promise<void>;
  onQuickCreateClient?: () => void;
};

const defaultDurationMinutes = 60;

function parseTimeToMinutes(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function formatMinutesToTime(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minute = (totalMinutes % 60).toString().padStart(2, '0');

  return `${hour}:${minute}`;
}

function buildEndTime(startTime: string, durationMinutes: number) {
  const startMinutes = parseTimeToMinutes(startTime);
  return formatMinutesToTime(startMinutes + durationMinutes);
}

export function findAppointmentConflict(
  values: Pick<AppointmentFormValues, 'horaInicio' | 'duracao'>,
  existingConflicts: AppointmentConflict[],
) {
  if (!values.horaInicio || !values.duracao) {
    return null;
  }

  const start = parseTimeToMinutes(values.horaInicio);
  const end = start + values.duracao;

  return (
    existingConflicts.find((item) => {
      const itemStart = parseTimeToMinutes(item.startTime);
      const itemEnd = parseTimeToMinutes(item.endTime);

      return start < itemEnd && end > itemStart;
    }) ?? null
  );
}

export function AppointmentFormModal({
  open,
  onClose,
  clients,
  services,
  existingConflicts,
  initialDate,
  initialStartTime,
  onSubmit,
  onQuickCreateClient,
}: AppointmentFormModalProps) {
  const [formValues, setFormValues] = useState<AppointmentFormValues>({
    date: initialDate,
    horaInicio: initialStartTime ?? '',
    servicoId: '',
    clienteId: '',
    duracao: defaultDurationMinutes,
    valor: 0,
    observacoes: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const initialFormValues = useMemo(() => ({
    date: initialDate,
    horaInicio: initialStartTime ?? '',
    servicoId: '',
    clienteId: '',
    duracao: defaultDurationMinutes,
    valor: 0,
    observacoes: '',
  }), [initialDate, initialStartTime]);

  const handleRestoreDraft = useCallback((nextValues: AppointmentFormValues) => {
    setFormValues(nextValues);
  }, []);

  const { clearDraft, draftSavedAt, wasRestored } = useFormDraft({
    draftKey: 'draft-appointment-form',
    enabled: open,
    values: formValues,
    initialValues: initialFormValues,
    onRestore: handleRestoreDraft,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setErrorMessage('');
  }, [open]);

  const conflict = useMemo(
    () => findAppointmentConflict(formValues, existingConflicts),
    [existingConflicts, formValues],
  );

  if (!open) {
    return null;
  }

  function handleServiceChange(serviceId: string) {
    const selectedService = services.find((service) => service.id === serviceId);

    if (!selectedService) {
      setFormValues((previous) => ({ ...previous, servicoId: serviceId }));
      return;
    }

    setFormValues((previous) => ({
      ...previous,
      servicoId: serviceId,
      duracao: selectedService.durationMinutes,
      valor: selectedService.price,
    }));
  }

  async function handleSchedule() {
    if (!formValues.date || !formValues.horaInicio || !formValues.servicoId || !formValues.clienteId) {
      setErrorMessage('Preencha data, hora, serviço e cliente para continuar.');
      return;
    }

    if (conflict) {
      setErrorMessage(`Conflito com ${conflict.label} (${conflict.startTime} às ${conflict.endTime}).`);
      return;
    }

    setErrorMessage('');
    setIsSaving(true);

    try {
      await onSubmit(formValues);
      clearDraft();
      onClose();
    } catch {
      setErrorMessage('Não foi possível salvar agora. Seu rascunho ficou salvo para tentar novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  const selectedClient = clients.find((client) => client.id === formValues.clienteId);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-coffee-blackCoffee/40 px-0 py-0 backdrop-blur-sm sm:px-4 sm:py-8 sm:items-center">
      <button type="button" aria-label="Fechar modal" className="absolute inset-0" onClick={onClose} />

      <section className="relative z-10 max-h-[100dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-3xl border border-coffee-cappuccino bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] shadow-elevated sm:max-h-[88vh] sm:rounded-3xl sm:p-6">
        <header className="mb-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Agenda</p>
          <h2 className="text-xl font-semibold text-coffee-darkRoast sm:text-2xl">Novo agendamento</h2>
          <p className="text-sm text-coffee-espresso">Preencha os dados do agendamento.</p>
          <AutosaveIndicator savedAt={draftSavedAt} restored={wasRestored} />
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-coffee-darkRoast">Data</span>
            <input
              type="date"
              value={formValues.date}
              onChange={(event) => setFormValues((previous) => ({ ...previous, date: event.target.value }))}
              className={cn(formFieldInputClass, "h-12 text-base")}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-coffee-darkRoast">Hora de início</span>
            <input
              type="time"
              value={formValues.horaInicio}
              onChange={(event) => setFormValues((previous) => ({ ...previous, horaInicio: event.target.value }))}
              className={cn(formFieldInputClass, "h-12 text-base")}
            />
          </label>

          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-coffee-darkRoast">Serviço</span>
            <Select
              value={formValues.servicoId}
              onChange={(event) => handleServiceChange(event.target.value)}
              className={cn(formFieldInputClass, "h-12 text-base")}
            >
              <option value="">Selecione um serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </label>

          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-coffee-darkRoast">Cliente</span>
              <button
                type="button"
                onClick={onQuickCreateClient}
                className="min-h-11 rounded-lg border border-coffee-cappuccino bg-white px-3 py-2 text-sm font-semibold text-coffee-darkRoast transition hover:border-coffee-mocha hover:text-coffee-mocha"
              >
                Novo cliente
              </button>
            </div>

            <Select
              value={formValues.clienteId}
              onChange={(event) => setFormValues((previous) => ({ ...previous, clienteId: event.target.value }))}
              className={cn(formFieldInputClass, "h-12 text-base")}
            >
              <option value="">Selecione uma cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} · {client.phone}
                </option>
              ))}
            </Select>
          </div>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-coffee-darkRoast">Duração (min)</span>
            <input
              type="number"
              min={15}
              step={15}
              value={formValues.duracao}
              onChange={(event) =>
                setFormValues((previous) => ({ ...previous, duracao: Number(event.target.value) || 0 }))
              }
              className={cn(formFieldInputClass, "h-12 text-base")}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-coffee-darkRoast">Valor (R$)</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={formValues.valor}
              onChange={(event) => setFormValues((previous) => ({ ...previous, valor: Number(event.target.value) || 0 }))}
              className={cn(formFieldInputClass, "h-12 text-base")}
            />
          </label>

          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-coffee-darkRoast">Observações</span>
            <Textarea
              rows={3}
              value={formValues.observacoes}
              onChange={(event) => setFormValues((previous) => ({ ...previous, observacoes: event.target.value }))}
              className="text-base"
              placeholder="Digite observações do atendimento"
            />
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-coffee-cappuccino bg-coffee-latte/35 px-3 py-2 text-sm text-coffee-darkRoast">
          {formValues.horaInicio
            ? `Previsão de término: ${buildEndTime(formValues.horaInicio, formValues.duracao || 0)}`
            : 'Selecione uma hora de início para calcular o término.'}
        </div>

        {selectedClient ? <p className="mt-2 text-xs text-coffee-espresso">Contato da cliente: {selectedClient.phone}</p> : null}

        {conflict ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            Existe conflito de horário com {conflict.label} ({conflict.startTime} às {conflict.endTime}).
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{errorMessage}</p>
        ) : null}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" className="h-12" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={isSaving} className="h-12 bg-coffee-mocha text-white hover:bg-coffee-hazelnut" onClick={handleSchedule}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </section>
    </div>
  );
}
