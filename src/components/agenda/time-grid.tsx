import type { ScheduleAppointment, ScheduleBlock } from '@/components/agenda/mock-daily-schedule';
import { AppointmentCard } from '@/components/agenda/appointment-card';
import { BlockCard } from '@/components/agenda/block-card';

type TimeGridProps = {
  slots: string[];
  appointments: ScheduleAppointment[];
  blocks: ScheduleBlock[];
  onClickEmptySlot?: (time: string) => void;
  onClickAppointment?: (appointment: ScheduleAppointment) => void;
};

export function TimeGrid({
  slots,
  appointments,
  blocks,
  onClickAppointment,
  onClickEmptySlot,
}: TimeGridProps) {
  const appointmentsByStart = new Map(appointments.map((appointment) => [appointment.startTime, appointment]));
  const blocksByStart = new Map(blocks.map((block) => [block.startTime, block]));

  return (
    <div className="max-h-[62vh] overflow-y-auto pr-1 sm:max-h-[64vh]">
      <ul className="space-y-2 pb-2">
        {slots.map((time) => {
          const appointment = appointmentsByStart.get(time);
          const block = blocksByStart.get(time);

          return (
            <li key={time} className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-2 sm:grid-cols-[84px_minmax(0,1fr)] sm:gap-3">
              <span className="pt-2 text-xs font-semibold text-coffee-espresso sm:pt-3 sm:text-sm">{time}</span>

              {appointment ? (
                <AppointmentCard appointment={appointment} onClick={onClickAppointment} />
              ) : block ? (
                <BlockCard block={block} />
              ) : (
                <button
                  type="button"
                  onClick={() => onClickEmptySlot?.(time)}
                  className="min-h-12 rounded-2xl border border-dashed border-coffee-cappuccino bg-white/90 px-3 py-2 text-left text-xs font-medium text-coffee-hazelnut transition hover:border-coffee-mocha hover:text-coffee-mocha focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-mocha/40 sm:min-h-14 sm:px-4 sm:text-sm"
                >
                  Horário livre · toque para criação rápida
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
