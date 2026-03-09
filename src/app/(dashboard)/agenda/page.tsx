'use client';

import { useRef, useState } from 'react';
import { DailyScheduleSection } from '@/components/agenda/daily-schedule-section';
import { CalendarView } from '@/components/calendar/calendar-view';
import { PageTitle } from '@/components/ui/page-title';

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const scheduleSectionRef = useRef<HTMLDivElement | null>(null);

  function handleSelectDate(date: Date) {
    setSelectedDate(date);

    requestAnimationFrame(() => {
      scheduleSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-8 lg:space-y-10">
      <PageTitle
        title="Agenda"
        subtitle="Agenda de atendimentos"
      />

      <div className="mx-auto w-full max-w-5xl lg:max-w-4xl xl:max-w-5xl">
        <CalendarView selectedDate={selectedDate} onSelectDate={handleSelectDate} />
      </div>

      <div ref={scheduleSectionRef}>
        <DailyScheduleSection selectedDate={selectedDate} />
      </div>
    </div>
  );
}
