'use client';

import { getMonthMatrix, weekDays } from '@/lib/domain/date';

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (value: Date) => void;
  monthDate: Date;
  onMonthChange: (value: Date) => void;
}

export function Calendar({ selectedDate, onSelectDate, monthDate, onMonthChange }: CalendarProps) {
  const days = getMonthMatrix(monthDate);

  return (
    <section className="rounded-3xl bg-white p-3 shadow-card sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <button
          className="rounded-lg border border-coffee-cappuccino px-3 py-2 text-sm"
          onClick={() => onMonthChange(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))}
        >
          ←
        </button>
        <h2 className="text-lg font-semibold capitalize text-coffee-darkRoast sm:text-2xl">
          {monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          className="rounded-lg border border-coffee-cappuccino px-3 py-2 text-sm"
          onClick={() => onMonthChange(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))}
        >
          →
        </button>
      </header>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-coffee-espresso sm:gap-2 sm:text-sm">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === monthDate.getMonth();
          const isSelected = day.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`aspect-square rounded-xl border text-sm transition sm:text-base ${
                isSelected
                  ? 'border-coffee-mocha bg-coffee-mocha text-white'
                  : isCurrentMonth
                    ? 'border-coffee-cappuccino bg-coffee-latte text-coffee-darkRoast hover:bg-coffee-cappuccino'
                    : 'border-transparent bg-transparent text-coffee-caramel'
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}
