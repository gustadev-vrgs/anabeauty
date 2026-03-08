import { ServicesList } from '@/components/services/services-list';
import { PageTitle } from '@/components/ui/page-title';

export default function ServicosPage() {
  return (
    <>
      <PageTitle title="Serviços" subtitle="Catálogo inicial de procedimentos e valores." />
      <ServicesList />
    </>
  );
}
