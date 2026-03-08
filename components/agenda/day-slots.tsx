'use client';

import { Appointment, TimeBlock } from '@/types/domain';
import { createDaySlots } from '@/lib/domain/date';

interface DaySlotsProps {
  appointments: Appointment[];
  blocks: TimeBlock[];
  onSelectSlot: (hourMinute: string) => void;
}

export function DaySlots({ appointments, blocks, onSelectSlot }: DaySlotsProps) {
  const slots = createDaySlots();

  function getStatus(slot: string) {
    const booked = appointments.find((item) => item.startsAt.slice(11, 16) === slot);
    if (booked) return { label: 'Agendado', className: 'bg-coffee-caramel text-white', details: booked.notes || 'Com cliente' };

    const blocked = blocks.find((item) => item.startsAt.slice(11, 16) === slot);
    if (blocked) return { label: 'Bloqueado', className: 'bg-coffee-darkRoast text-white', details: blocked.reason || 'Horário indisponível' };

    return { label: 'Livre', className: 'bg-white', details: 'Toque para criar agendamento' };
  }

  return (
    <section className="rounded-3xl bg-white p-4 shadow-card sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-coffee-darkRoast">Horários do dia</h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => {
          const status = getStatus(slot);
          return (
            <button
              key={slot}
              onClick={() => onSelectSlot(slot)}
              className={`rounded-xl border border-coffee-cappuccino px-3 py-3 text-left ${status.className}`}
            >
              <p className="text-base font-semibold">{slot}</p>
              <p className="text-xs opacity-90">{status.label}</p>
              <p className="mt-1 text-xs opacity-80">{status.details}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
