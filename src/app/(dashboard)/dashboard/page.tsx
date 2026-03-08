import { AppointmentsList } from '@/components/appointments/appointments-list';
import { PageTitle } from '@/components/ui/page-title';

export default function DashboardPage() {
  return (
    <>
      <PageTitle title="Dashboard" subtitle="Resumo rápido da operação do dia." />
      <AppointmentsList />
    </>
  );
}
