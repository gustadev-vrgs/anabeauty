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
    <section className="rounded-3xl border border-coffee-cappuccino/70 bg-coffee-latte/90 p-4 shadow-card sm:p-6 lg:p-8">
      <header className="mb-6 space-y-4 border-b border-coffee-cappuccino/70 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee-espresso">Hoje · {todayLabel}</p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleMonthChange(-1)}
            className="rounded-full border border-coffee-macchiato bg-white px-4 py-2 text-sm font-semibold text-coffee-darkRoast transition hover:border-coffee-mocha hover:text-coffee-mocha"
            aria-label="Mês anterior"
          >
            ← Anterior
          </button>

          <h2 className="text-xl font-semibold capitalize text-coffee-darkRoast sm:text-2xl">{monthLabel}</h2>

          <button
            type="button"
            onClick={() => handleMonthChange(1)}
            className="rounded-full border border-coffee-macchiato bg-white px-4 py-2 text-sm font-semibold text-coffee-darkRoast transition hover:border-coffee-mocha hover:text-coffee-mocha"
            aria-label="Próximo mês"
          >
            Próximo →
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-coffee-espresso sm:gap-3 sm:text-sm">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2 sm:gap-3">
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
                'aspect-square min-h-10 rounded-2xl border text-sm font-medium transition sm:text-base',
                isCurrentMonth
                  ? 'border-coffee-cappuccino/70 bg-white text-coffee-darkRoast hover:border-coffee-mocha'
                  : 'border-transparent bg-coffee-cappuccino/20 text-coffee-hazelnut/70',
                isToday && !isSelected && 'border-coffee-mocha/60 text-coffee-mocha',
                isSelected && 'border-coffee-mocha bg-coffee-mocha text-white shadow-elevated',
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
