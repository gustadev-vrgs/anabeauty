'use client';

import { useState } from 'react';
import { DailyScheduleSection } from '@/components/agenda/daily-schedule-section';
import { CalendarView } from '@/components/calendar/calendar-view';
import { PageTitle } from '@/components/ui/page-title';

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 lg:space-y-8">
      <PageTitle
        title="Agenda"
        subtitle="Escolha um dia no calendário para iniciar o agendamento."
      />

      <div className="mx-auto w-full max-w-5xl">
        <CalendarView selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      <DailyScheduleSection selectedDate={selectedDate} />
    </div>
  );
}
