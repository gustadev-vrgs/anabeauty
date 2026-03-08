'use client';

import { useMemo, useState } from 'react';
import { CalendarView } from '@/components/calendar/calendar-view';
import { PageTitle } from '@/components/ui/page-title';
import { cn } from '@/utils/cn';

const mockSlotsByWeekday: Record<number, string[]> = {
  0: ['09:00', '10:30', '14:00'],
  1: ['08:30', '10:00', '13:30', '16:00', '18:00'],
  2: ['09:00', '11:00', '15:00', '17:30'],
  3: ['08:00', '09:30', '12:00', '14:30', '16:30'],
  4: ['09:00', '10:30', '13:00', '15:30', '19:00'],
  5: ['08:00', '10:00', '12:30', '14:00'],
  6: ['09:30', '11:30', '13:30'],
};

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateLabel = selectedDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const availableSlots = useMemo(() => mockSlotsByWeekday[selectedDate.getDay()] ?? [], [selectedDate]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 lg:space-y-8">
      <PageTitle
        title="Agenda"
        subtitle="Escolha um dia no calendário para iniciar o agendamento."
      />

      <div className="mx-auto w-full max-w-5xl">
        <CalendarView selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      <section className="rounded-3xl border border-coffee-cappuccino/70 bg-coffee-latte/75 p-4 shadow-card sm:p-6">
        <div className="mb-4 border-b border-coffee-cappuccino/70 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Horários do dia selecionado</p>
          <h3 className="mt-2 text-lg font-semibold capitalize text-coffee-darkRoast sm:text-xl">{selectedDateLabel}</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              className={cn(
                'rounded-2xl border border-coffee-macchiato/80 bg-white px-4 py-3 text-center text-sm font-semibold text-coffee-darkRoast transition',
                'hover:border-coffee-mocha hover:text-coffee-mocha',
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
