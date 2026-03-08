'use client';

import { useMemo, useState } from 'react';
import { AppointmentFormModal } from '@/components/agenda/appointment-form-modal';
import { TimeBlockModal, type TimeBlockFormValues } from '@/components/agenda/time-block-modal';
import {
  formatDateKey,
  generateHalfHourSlots,
  mockDailyAppointments,
  mockDailyBlocks,
  type ScheduleAppointment,
  type ScheduleBlock,
} from '@/components/agenda/mock-daily-schedule';
import { TimeGrid } from '@/components/agenda/time-grid';
import { useCachedCollection } from '@/hooks/use-cached-collection';
import { listClients } from '@/services/firestore/clients.firestore';
import { createAppointment, listAppointments } from '@/services/firestore/appointments.firestore';
import { createTimeBlock, listTimeBlocks } from '@/services/firestore/time-blocks.firestore';
import { listServices } from '@/services/firestore/services.firestore';
import type { Appointment, Client, Service, TimeBlock } from '@/types';

type DailyScheduleSectionProps = {
  selectedDate: Date;
};

function sortTimes(left: string, right: string) {
  const [leftHour, leftMinute] = left.split(':').map(Number);
  const [rightHour, rightMinute] = right.split(':').map(Number);

  const leftValue = leftHour * 60 + leftMinute;
  const rightValue = rightHour * 60 + rightMinute;

  return leftValue - rightValue;
}

function buildEndTime(startTime: string, duration: number) {
  const [hour, minute] = startTime.split(':').map(Number);
  const startMinutes = hour * 60 + minute;
  const endMinutes = startMinutes + duration;
  const endHour = String(Math.floor(endMinutes / 60)).padStart(2, '0');
  const endMinute = String(endMinutes % 60).padStart(2, '0');

  return `${endHour}:${endMinute}`;
}

export function DailyScheduleSection({ selectedDate }: DailyScheduleSectionProps) {
  const dateKey = formatDateKey(selectedDate);

  const { data: clients } = useCachedCollection<Client>({ cacheKey: 'clients', loader: listClients });
  const { data: services } = useCachedCollection<Service>({ cacheKey: 'services', loader: listServices });
  const { data: appointmentsData, updateCache: updateAppointmentsCache } = useCachedCollection<Appointment>({
    cacheKey: 'appointments',
    loader: listAppointments,
  });
  const { data: blocksData, updateCache: updateBlocksCache } = useCachedCollection<TimeBlock>({
    cacheKey: 'timeBlocks',
    loader: listTimeBlocks,
  });

  const defaultSlots = useMemo(() => generateHalfHourSlots(8, 20), []);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [prefilledStartTime, setPrefilledStartTime] = useState<string | undefined>(undefined);
  const [customSlotsByDate, setCustomSlotsByDate] = useState<Record<string, string[]>>({});
  const [newCustomTime, setNewCustomTime] = useState('');

  const appointmentScheduleItems = useMemo(
    () =>
      appointmentsData.map(
        (appointment) =>
          ({
            id: appointment.id,
            date: appointment.date,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            clientName: appointment.clientName,
            procedureName: appointment.serviceName,
          }) satisfies ScheduleAppointment,
      ),
    [appointmentsData],
  );

  const blockScheduleItems = useMemo(
    () =>
      blocksData.map(
        (block) =>
          ({
            id: block.id,
            date: block.date,
            startTime: block.startTime,
            endTime: block.endTime,
            reason: block.reason,
            blockType: block.blockType,
            notes: block.notes,
          }) satisfies ScheduleBlock,
      ),
    [blocksData],
  );

  const appointments = [...mockDailyAppointments, ...appointmentScheduleItems].filter((appointment) => appointment.date === dateKey);
  const blocks = [...mockDailyBlocks, ...blockScheduleItems].filter((block) => block.date === dateKey);

  const appointmentConflicts = [
    ...appointments.map((appointment) => ({
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      label: `agendamento de ${appointment.clientName}`,
    })),
    ...blocks.map((block) => ({
      startTime: block.startTime,
      endTime: block.endTime,
      label: block.reason ? `bloqueio: ${block.reason}` : 'bloqueio de horário',
    })),
  ];

  const slots = useMemo(() => {
    const customSlotsForDay = customSlotsByDate[dateKey] ?? [];
    const dynamicSlots = [...appointments.map((item) => item.startTime), ...blocks.map((item) => item.startTime)];
    return [...new Set([...defaultSlots, ...customSlotsForDay, ...dynamicSlots])].sort(sortTimes);
  }, [appointments, blocks, customSlotsByDate, dateKey, defaultSlots]);

  const selectedDateLabel = selectedDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  function handleAddCustomTime() {
    if (!newCustomTime) {
      return;
    }

    setCustomSlotsByDate((previousSlots) => {
      const daySlots = previousSlots[dateKey] ?? [];
      if (daySlots.includes(newCustomTime) || defaultSlots.includes(newCustomTime)) {
        return previousSlots;
      }

      return {
        ...previousSlots,
        [dateKey]: [...daySlots, newCustomTime],
      };
    });

    setNewCustomTime('');
  }

  async function handleCreateAppointment(values: {
    date: string;
    horaInicio: string;
    servicoId: string;
    clienteId: string;
    duracao: number;
    valor: number;
    observacoes: string;
  }) {
    const service = services.find((item) => item.id === values.servicoId);
    const client = clients.find((item) => item.id === values.clienteId);

    if (!service || !client) {
      throw new Error('Dados inválidos para salvar agendamento');
    }

    const payload: Appointment = {
      id: `apt-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      serviceId: service.id,
      serviceName: service.name,
      date: values.date,
      startTime: values.horaInicio,
      endTime: buildEndTime(values.horaInicio, values.duracao),
      durationMinutes: values.duracao,
      price: values.valor,
      status: 'agendado',
      notes: values.observacoes,
      createdAt: new Date().toISOString(),
    };

    await createAppointment(payload);
    updateAppointmentsCache((previous) => [payload, ...previous]);
  }

  function createDateRange(startDate: string, endDate: string) {
    const dates: string[] = [];
    const cursor = new Date(`${startDate}T00:00:00`);
    const limit = new Date(`${endDate}T00:00:00`);

    while (cursor <= limit) {
      dates.push(formatDateKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
  }

  async function handleCreateTimeBlock(values: TimeBlockFormValues) {
    const coveredDates = createDateRange(values.dataInicio, values.dataFim);

    const generatedBlocks = coveredDates.map((currentDate, index) => {
      const isFirstDay = index === 0;
      const isLastDay = index === coveredDates.length - 1;

      let startTime = values.horaInicio || '08:00';
      let endTime = values.horaFim || '20:00';

      if (values.tipoBloqueio === 'dia_inteiro') {
        startTime = '08:00';
        endTime = '20:00';
      }

      if (values.tipoBloqueio === 'intervalo' && coveredDates.length > 1) {
        if (!isFirstDay) {
          startTime = '08:00';
        }

        if (!isLastDay) {
          endTime = '20:00';
        }
      }

      return {
        id: `blk-${Date.now()}-${currentDate}`,
        date: currentDate,
        startTime,
        endTime,
        reason: values.observacoes || 'Horário bloqueado',
        blockType: values.tipoBloqueio,
        notes: values.observacoes,
        createdAt: new Date().toISOString(),
      } satisfies TimeBlock;
    });

    await Promise.all(generatedBlocks.map((item) => createTimeBlock(item)));
    updateBlocksCache((previous) => [...generatedBlocks, ...previous]);
  }

  return (
    <section className="rounded-3xl border border-coffee-cappuccino/70 bg-white p-4 shadow-card sm:p-7">
      <div className="flex flex-col gap-5 border-b border-coffee-cappuccino/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Horários do dia selecionado</p>
          <h3 className="mt-2 text-lg font-semibold capitalize text-coffee-darkRoast sm:text-xl">{selectedDateLabel}</h3>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => { setPrefilledStartTime(undefined); setIsAppointmentModalOpen(true); }} className="min-h-12 rounded-xl border border-coffee-mocha bg-coffee-mocha px-4 text-sm font-semibold text-white transition hover:bg-coffee-hazelnut">
            + Novo agendamento
          </button>
          <button type="button" onClick={() => setIsBlockModalOpen(true)} className="min-h-12 rounded-xl border border-coffee-cappuccino bg-white px-4 text-sm font-semibold text-coffee-darkRoast transition hover:bg-coffee-latte">
            Bloquear horário
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-coffee-cappuccino/70 bg-coffee-latte/35 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coffee-espresso">Adicionar horário personalizado</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input type="time" value={newCustomTime} onChange={(event) => setNewCustomTime(event.target.value)} className="min-h-12 w-full rounded-xl border border-coffee-cappuccino bg-white px-3 text-base font-medium text-coffee-darkRoast focus:border-coffee-mocha focus:outline-none focus:ring-2 focus:ring-coffee-latte sm:max-w-44 sm:text-sm" aria-label="Selecionar horário personalizado" />
          <button type="button" onClick={handleAddCustomTime} className="min-h-12 rounded-xl border border-coffee-cappuccino bg-white px-4 text-sm font-semibold text-coffee-darkRoast transition hover:bg-coffee-latte">
            Adicionar horário
          </button>
        </div>
      </div>

      <div className="mt-6">
        <TimeGrid slots={slots} appointments={appointments} blocks={blocks} onClickAppointment={() => undefined} onClickEmptySlot={(time) => { setPrefilledStartTime(time); setIsAppointmentModalOpen(true); }} />
      </div>

      <AppointmentFormModal
        open={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        clients={clients.map((item) => ({ id: item.id, name: item.name, phone: item.phone }))}
        services={services.map((item) => ({ id: item.id, name: item.name, durationMinutes: item.durationMinutes, price: item.price }))}
        existingConflicts={appointmentConflicts}
        initialDate={dateKey}
        initialStartTime={prefilledStartTime}
        onSubmit={handleCreateAppointment}
      />

      <TimeBlockModal
        open={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        initialDate={dateKey}
        existingConflicts={appointmentConflicts}
        onSubmit={handleCreateTimeBlock}
      />
    </section>
  );
}
