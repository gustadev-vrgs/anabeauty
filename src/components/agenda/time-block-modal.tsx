'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formFieldInputClass } from '@/components/ui/form-field';
import { cn } from '@/utils/cn';
import { AutosaveIndicator } from '@/components/ui/autosave-indicator';
import { useFormDraft } from '@/hooks/use-form-draft';
import type { TimeBlockType } from '@/types';

export type TimeBlockFormValues = {
  tipoBloqueio: TimeBlockType;
  dataInicio: string;
  horaInicio: string;
  dataFim: string;
  horaFim: string;
  observacoes: string;
};

type TimeBlockConflict = {
  startTime: string;
  endTime: string;
  label: string;
};

type TimeBlockModalProps = {
  open: boolean;
  initialDate: string;
  existingConflicts: TimeBlockConflict[];
  onClose: () => void;
  onSubmit: (values: TimeBlockFormValues) => Promise<void>;
};

const blockTypeOptions: Array<{ value: TimeBlockType; label: string; description: string }> = [
  {
    value: 'horario_unico',
    label: 'Horário único',
    description: 'Bloqueia um horário específico em um único dia.',
  },
  {
    value: 'intervalo',
    label: 'Intervalo',
    description: 'Bloqueia um período contínuo entre datas e horários.',
  },
  {
    value: 'dia_inteiro',
    label: 'Dia inteiro',
    description: 'Bloqueia o(s) dia(s) por completo.',
  },
];

function toDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

function parseTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function hasTimeOverlap(
  values: Pick<TimeBlockFormValues, 'tipoBloqueio' | 'horaInicio' | 'horaFim'>,
  existingConflicts: TimeBlockConflict[],
) {
  if (values.tipoBloqueio === 'dia_inteiro') {
    return existingConflicts[0] ?? null;
  }

  const start = parseTimeToMinutes(values.horaInicio);
  const end = parseTimeToMinutes(values.horaFim);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return null;
  }

  return (
    existingConflicts.find((item) => {
      const conflictStart = parseTimeToMinutes(item.startTime);
      const conflictEnd = parseTimeToMinutes(item.endTime);

      return start < conflictEnd && end > conflictStart;
    }) ?? null
  );
}

export function TimeBlockModal({
  open,
  initialDate,
  existingConflicts,
  onClose,
  onSubmit,
}: TimeBlockModalProps) {
  const [values, setValues] = useState<TimeBlockFormValues>({
    tipoBloqueio: 'horario_unico',
    dataInicio: initialDate,
    horaInicio: '',
    dataFim: initialDate,
    horaFim: '',
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
    tipoBloqueio: 'horario_unico' as const,
    dataInicio: initialDate,
    horaInicio: '',
    dataFim: initialDate,
    horaFim: '',
    observacoes: '',
  }), [initialDate]);

  const handleRestoreDraft = useCallback((nextValues: TimeBlockFormValues) => {
    setValues(nextValues);
  }, []);

  const { clearDraft, draftSavedAt, wasRestored } = useFormDraft({
    draftKey: 'draft-timeblock-form',
    enabled: open,
    values,
    initialValues: initialFormValues,
    onRestore: handleRestoreDraft,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setErrorMessage('');
  }, [open]);

  const conflict = useMemo(() => hasTimeOverlap(values, existingConflicts), [existingConflicts, values]);

  if (!open) {
    return null;
  }

  function handleTypeChange(nextType: TimeBlockType) {
    setValues((previous) => {
      if (nextType === 'horario_unico') {
        return {
          ...previous,
          tipoBloqueio: nextType,
          dataFim: previous.dataInicio,
        };
      }

      if (nextType === 'dia_inteiro') {
        return {
          ...previous,
          tipoBloqueio: nextType,
          horaInicio: '',
          horaFim: '',
        };
      }

      return {
        ...previous,
        tipoBloqueio: nextType,
      };
    });
  }

  async function handleConfirm() {
    if (!values.dataInicio) {
      setErrorMessage('Selecione a data de início do bloqueio.');
      return;
    }

    if (values.tipoBloqueio !== 'dia_inteiro' && (!values.horaInicio || !values.horaFim)) {
      setErrorMessage('Informe hora de início e hora de fim para continuar.');
      return;
    }

    const endDate = values.tipoBloqueio === 'horario_unico' ? values.dataInicio : values.dataFim;

    if (!endDate) {
      setErrorMessage('Selecione a data final do bloqueio.');
      return;
    }

    if (values.tipoBloqueio === 'dia_inteiro' && endDate < values.dataInicio) {
      setErrorMessage('A data final deve ser igual ou posterior à data inicial.');
      return;
    }

    if (values.tipoBloqueio !== 'dia_inteiro') {
      const start = toDateTime(values.dataInicio, values.horaInicio);
      const end = toDateTime(endDate, values.horaFim);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        setErrorMessage('Verifique a data e os horários informados.');
        return;
      }

      if (end <= start) {
        setErrorMessage('O horário final precisa ser maior que o horário inicial.');
        return;
      }
    }

    if (conflict && values.tipoBloqueio !== 'intervalo') {
      setErrorMessage(`Já existe ${conflict.label} nesse período (${conflict.startTime} às ${conflict.endTime}).`);
      return;
    }

    setErrorMessage('');
    setIsSaving(true);

    try {
      await onSubmit({
        ...values,
        dataFim: endDate,
      });
      clearDraft();
      onClose();
    } catch {
      setErrorMessage('Não foi possível salvar agora. Seu rascunho foi preservado para tentar de novo.');
    } finally {
      setIsSaving(false);
    }
  }

  const shouldShowEndDate = values.tipoBloqueio !== 'horario_unico';
  const shouldShowHours = values.tipoBloqueio !== 'dia_inteiro';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-coffee-blackCoffee/45 px-0 py-0 backdrop-blur-sm sm:px-4 sm:py-8 sm:items-center">
      <button type="button" aria-label="Fechar modal" className="absolute inset-0" onClick={onClose} />

      <section className="relative z-10 max-h-[100dvh] w-full max-w-xl overflow-y-auto overscroll-contain rounded-t-3xl border border-coffee-cappuccino bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] shadow-elevated sm:max-h-[88vh] sm:rounded-3xl sm:p-6">
        <header className="mb-5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Agenda</p>
          <h2 className="text-xl font-semibold text-coffee-darkRoast sm:text-2xl">Novo bloqueio</h2>
          <p className="text-sm text-coffee-espresso">Informe o período de bloqueio.</p>
          <AutosaveIndicator savedAt={draftSavedAt} restored={wasRestored} />
        </header>

        <div className="space-y-4">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-coffee-darkRoast">Tipo de bloqueio</span>
            <Select
              value={values.tipoBloqueio}
              onChange={(event) => handleTypeChange(event.target.value as TimeBlockType)}
              className={cn(formFieldInputClass, "h-12 text-base")}
            >
              {blockTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-coffee-espresso">
              {blockTypeOptions.find((item) => item.value === values.tipoBloqueio)?.description}
            </p>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-coffee-darkRoast">Data início</span>
              <input
                type="date"
                value={values.dataInicio}
                onChange={(event) =>
                  setValues((previous) => ({
                    ...previous,
                    dataInicio: event.target.value,
                    dataFim: previous.tipoBloqueio === 'horario_unico' ? event.target.value : previous.dataFim,
                  }))
                }
                className={cn(formFieldInputClass, "h-12 text-base")}
              />
            </label>

            {shouldShowEndDate ? (
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-coffee-darkRoast">Data fim</span>
                <input
                  type="date"
                  value={values.dataFim}
                  min={values.dataInicio}
                  onChange={(event) => setValues((previous) => ({ ...previous, dataFim: event.target.value }))}
                  className={cn(formFieldInputClass, "h-12 text-base")}
                />
              </label>
            ) : null}

            {shouldShowHours ? (
              <>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-coffee-darkRoast">Hora início</span>
                  <input
                    type="time"
                    value={values.horaInicio}
                    onChange={(event) => setValues((previous) => ({ ...previous, horaInicio: event.target.value }))}
                    className={cn(formFieldInputClass, "h-12 text-base")}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-coffee-darkRoast">Hora fim</span>
                  <input
                    type="time"
                    value={values.horaFim}
                    onChange={(event) => setValues((previous) => ({ ...previous, horaFim: event.target.value }))}
                    className={cn(formFieldInputClass, "h-12 text-base")}
                  />
                </label>
              </>
            ) : null}
          </div>

          <label className="space-y-1.5">
            <span className="text-sm font-medium text-coffee-darkRoast">Observações</span>
            <Textarea
              rows={3}
              value={values.observacoes}
              onChange={(event) => setValues((previous) => ({ ...previous, observacoes: event.target.value }))}
              placeholder="Digite observações do atendimento"
              className="text-base"
            />
          </label>
        </div>

        {conflict ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
            Atenção: já existe {conflict.label} próximo desse período ({conflict.startTime} às {conflict.endTime}).
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{errorMessage}</p>
        ) : null}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" className="h-12" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={isSaving} className="h-12 bg-coffee-mocha text-white hover:bg-coffee-hazelnut" onClick={handleConfirm}>
            {isSaving ? 'Salvando...' : 'Bloquear'}
          </Button>
        </div>
      </section>
    </div>
  );
}
