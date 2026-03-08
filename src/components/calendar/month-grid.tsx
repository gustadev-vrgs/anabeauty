'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getMonthMatrix, weekDays } from '@/lib/date';
import { cn } from '@/utils/cn';

export function MonthGrid() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthDate, setMonthDate] = useState(new Date());

  const days = useMemo(() => getMonthMatrix(monthDate), [monthDate]);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))}>{'<'}</button>
        <p className="font-semibold text-coffee-darkRoast">
          {monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </p>
        <button onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))}>{'>'}</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-coffee-espresso">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === monthDate.getMonth();
          const isSelected = day.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={cn(
                'rounded-lg p-2 text-sm transition-colors',
                isSelected && 'bg-coffee-mocha text-white',
                !isSelected && isCurrentMonth && 'bg-coffee-latte text-coffee-darkRoast hover:bg-coffee-cappuccino',
                !isCurrentMonth && 'text-coffee-hazelnut/60',
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
