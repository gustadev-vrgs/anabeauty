'use client';

import { useMemo, useState } from 'react';
import { AppointmentFormModal } from '@/components/agenda/appointment-form-modal';
import { TimeBlockModal, type TimeBlockFormValues } from '@/components/agenda/time-block-modal';
import {
  mockAppointmentClients,
  mockAppointmentServices,
} from '@/components/agenda/appointment-form-mocks';
import {
  formatDateKey,
  generateHalfHourSlots,
  mockDailyAppointments,
  mockDailyBlocks,
  type ScheduleAppointment,
  type ScheduleBlock,
} from '@/components/agenda/mock-daily-schedule';
import { TimeGrid } from '@/components/agenda/time-grid';

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

export function DailyScheduleSection({ selectedDate }: DailyScheduleSectionProps) {
  const dateKey = formatDateKey(selectedDate);

  const defaultSlots = useMemo(() => generateHalfHourSlots(8, 20), []);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [prefilledStartTime, setPrefilledStartTime] = useState<string | undefined>(undefined);
  const [createdAppointments, setCreatedAppointments] = useState<ScheduleAppointment[]>([]);
  const [createdBlocks, setCreatedBlocks] = useState<ScheduleBlock[]>([]);
  const [customSlotsByDate, setCustomSlotsByDate] = useState<Record<string, string[]>>({});
  const [newCustomTime, setNewCustomTime] = useState('');

  const appointments = [...mockDailyAppointments, ...createdAppointments].filter(
    (appointment) => appointment.date === dateKey,
  );
  const blocks = [...mockDailyBlocks, ...createdBlocks].filter((block) => block.date === dateKey);
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

  function handleNewAppointment() {
    setPrefilledStartTime(undefined);
    setIsAppointmentModalOpen(true);
  }

  function handleBlockSchedule() {
    setIsBlockModalOpen(true);
  }

  function handleOpenClientRegister() {
    // Placeholder de UX até integração com cadastro de clientes real.
    // eslint-disable-next-line no-console
    console.log('Abrir cadastro de nova cliente');
  }

  function handleEditAppointment(appointment: ScheduleAppointment) {
    // Placeholder de UX até integração com edição real.
    // eslint-disable-next-line no-console
    console.log('Editar agendamento', appointment.id);
  }

  function handleQuickCreate(time: string) {
    setPrefilledStartTime(time);
    setIsAppointmentModalOpen(true);
  }

  function buildEndTime(startTime: string, duration: number) {
    const [hour, minute] = startTime.split(':').map(Number);
    const startMinutes = hour * 60 + minute;
    const endMinutes = startMinutes + duration;
    const endHour = String(Math.floor(endMinutes / 60)).padStart(2, '0');
    const endMinute = String(endMinutes % 60).padStart(2, '0');

    return `${endHour}:${endMinute}`;
  }

  function handleCreateAppointment(values: {
    date: string;
    horaInicio: string;
    servicoId: string;
    clienteId: string;
    duracao: number;
  }) {
    const service = mockAppointmentServices.find((item) => item.id === values.servicoId);
    const client = mockAppointmentClients.find((item) => item.id === values.clienteId);

    if (!service || !client) {
      return;
    }

    setCreatedAppointments((previous) => [
      ...previous,
      {
        id: `apt-local-${Date.now()}`,
        date: values.date,
        startTime: values.horaInicio,
        endTime: buildEndTime(values.horaInicio, values.duracao),
        clientName: client.name,
        procedureName: service.name,
      },
    ]);
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

  function handleCreateTimeBlock(values: TimeBlockFormValues) {
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
        id: `blk-local-${Date.now()}-${currentDate}`,
        date: currentDate,
        startTime,
        endTime,
        reason: values.observacoes || 'Horário bloqueado',
        blockType: values.tipoBloqueio,
        notes: values.observacoes,
      } satisfies ScheduleBlock;
    });

    setCreatedBlocks((previous) => [...previous, ...generatedBlocks]);
  }

  return (
    <section className="rounded-3xl border border-coffee-cappuccino/70 bg-coffee-latte/75 p-3.5 shadow-card sm:p-6">
      <div className="flex flex-col gap-4 border-b border-coffee-cappuccino/70 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Horários do dia selecionado</p>
          <h3 className="mt-2 text-lg font-semibold capitalize text-coffee-darkRoast sm:text-xl">{selectedDateLabel}</h3>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleNewAppointment}
            className="min-h-12 rounded-xl border border-coffee-mocha bg-coffee-mocha px-4 text-sm font-semibold text-white transition hover:bg-coffee-hazelnut"
          >
            + Novo agendamento
          </button>
          <button
            type="button"
            onClick={handleBlockSchedule}
            className="min-h-12 rounded-xl border border-coffee-hazelnut bg-white px-4 text-sm font-semibold text-coffee-darkRoast transition hover:bg-coffee-latte"
          >
            Bloquear horário
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-coffee-cappuccino/70 bg-white/70 p-3 sm:p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coffee-espresso">Adicionar horário personalizado</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            type="time"
            value={newCustomTime}
            onChange={(event) => setNewCustomTime(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-coffee-macchiato bg-white px-3 text-base font-medium text-coffee-darkRoast focus:border-coffee-mocha focus:outline-none focus:ring-2 focus:ring-coffee-cappuccino/60 sm:max-w-44 sm:text-sm"
            aria-label="Selecionar horário personalizado"
          />
          <button
            type="button"
            onClick={handleAddCustomTime}
            className="min-h-12 rounded-xl border border-coffee-hazelnut bg-coffee-latte px-4 text-sm font-semibold text-coffee-darkRoast transition hover:bg-coffee-cappuccino"
          >
            Adicionar horário
          </button>
        </div>
      </div>

      <div className="mt-4">
        <TimeGrid
          slots={slots}
          appointments={appointments}
          blocks={blocks}
          onClickAppointment={handleEditAppointment}
          onClickEmptySlot={handleQuickCreate}
        />
      </div>

      <AppointmentFormModal
        open={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        clients={mockAppointmentClients}
        services={mockAppointmentServices}
        existingConflicts={appointmentConflicts}
        initialDate={dateKey}
        initialStartTime={prefilledStartTime}
        onQuickCreateClient={handleOpenClientRegister}
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
