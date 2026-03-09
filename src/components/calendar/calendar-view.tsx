'use client';

import { useMemo, useState } from 'react';
import { getMonthMatrix, weekDays } from '@/lib/date';
import { cn } from '@/utils/cn';

type CalendarViewProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

function isSameDay(left: Date, right: Date) {
  return (
    left.getDate() === right.getDate() &&
    left.getMonth() === right.getMonth() &&
    left.getFullYear() === right.getFullYear()
  );
}

export function CalendarView({ selectedDate, onSelectDate }: CalendarViewProps) {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const monthDays = useMemo(() => getMonthMatrix(visibleMonth), [visibleMonth]);

  const monthLabel = visibleMonth.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  const todayLabel = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  function handleMonthChange(offset: number) {
    setVisibleMonth((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  }

  return (
    <section className="rounded-3xl border border-coffee-cappuccino/70 bg-white p-4 shadow-card sm:p-7 lg:p-9">
      <header className="mb-7 space-y-4 border-b border-coffee-cappuccino/70 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Hoje · {todayLabel}</p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleMonthChange(-1)}
            className="min-h-11 rounded-full border border-coffee-cappuccino bg-white px-4 py-2 text-sm font-semibold text-coffee-darkRoast transition-colors duration-150 hover:border-coffee-mocha hover:text-coffee-mocha"
            aria-label="Mês anterior"
          >
            ← Anterior
          </button>

          <h2 className="text-lg font-semibold capitalize text-coffee-darkRoast sm:text-2xl">{monthLabel}</h2>

          <button
            type="button"
            onClick={() => handleMonthChange(1)}
            className="min-h-11 rounded-full border border-coffee-cappuccino bg-white px-4 py-2 text-sm font-semibold text-coffee-darkRoast transition-colors duration-150 hover:border-coffee-mocha hover:text-coffee-mocha"
            aria-label="Próximo mês"
          >
            Próximo →
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-coffee-espresso sm:gap-3.5 sm:text-sm">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2 sm:mt-4 sm:gap-3.5">
        {monthDays.map((day) => {
          const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                'aspect-square min-h-11 rounded-xl border text-sm font-medium transition-colors duration-150 sm:min-h-12 sm:rounded-2xl sm:text-base',
                isCurrentMonth
                  ? 'border-coffee-cappuccino/70 bg-white text-coffee-darkRoast hover:border-coffee-mocha'
                  : 'border-coffee-cappuccino/30 bg-coffee-latte/25 text-coffee-hazelnut/80',
                isToday && !isSelected && 'border-coffee-mocha/60 text-coffee-mocha',
                isSelected && '!border-coffee-mocha !bg-coffee-mocha !text-coffee-cream shadow-elevated hover:!border-coffee-mocha',
              )}
              aria-pressed={isSelected}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}
