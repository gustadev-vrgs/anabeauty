import type { ScheduleBlock } from '@/components/agenda/mock-daily-schedule';
import { cn } from '@/utils/cn';

type BlockCardProps = {
  block: ScheduleBlock;
  className?: string;
};

export function BlockCard({ block, className }: BlockCardProps) {
  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-coffee-hazelnut/45 bg-coffee-latte/95 px-3 py-2 text-coffee-darkRoast shadow-sm sm:px-4 sm:py-3',
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-coffee-espresso">Bloqueado</p>
      <p className="mt-1 text-sm font-semibold sm:text-base">{block.startTime} · {block.endTime}</p>
      <p className="text-xs text-coffee-hazelnut sm:text-sm">{block.reason ?? 'Horário indisponível'}</p>
    </div>
  );
}
