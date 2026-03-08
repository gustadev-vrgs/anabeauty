import { MonthGrid } from '@/components/calendar/month-grid';
import { AppointmentsList } from '@/components/appointments/appointments-list';
import { PageTitle } from '@/components/ui/page-title';

export default function AgendaPage() {
  return (
    <>
      <PageTitle title="Agenda" subtitle="Visualize horários disponíveis e atendimentos confirmados." />
      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <MonthGrid />
        <AppointmentsList />
      </section>
    </>
  );
}
