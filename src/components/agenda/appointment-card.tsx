import type { ScheduleAppointment } from '@/components/agenda/mock-daily-schedule';
import { cn } from '@/utils/cn';

type AppointmentCardProps = {
  appointment: ScheduleAppointment;
  onClick?: (appointment: ScheduleAppointment) => void;
  className?: string;
};

export function AppointmentCard({ appointment, onClick, className }: AppointmentCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(appointment)}
      className={cn(
        'w-full rounded-2xl border border-coffee-mocha/35 bg-coffee-mocha px-3 py-2 text-left text-white shadow-[0_8px_20px_rgba(168,111,71,0.35)] transition hover:bg-coffee-hazelnut focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:px-4 sm:py-3',
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coffee-latte/90">
        {appointment.startTime} · {appointment.endTime}
      </p>
      <p className="mt-1 text-sm font-semibold sm:text-base">{appointment.clientName}</p>
      <p className="text-xs text-coffee-latte/90 sm:text-sm">{appointment.procedureName}</p>
    </button>
  );
}
