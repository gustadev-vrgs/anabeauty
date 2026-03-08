import { ServicesList } from '@/components/services/services-list';
import { PageTitle } from '@/components/ui/page-title';

export default function ServicosPage() {
  return (
    <>
      <PageTitle
        title="Serviços e Procedimentos"
        subtitle="Gerencie o catálogo com busca, disponibilidade para agendamento e edição rápida."
      />
      <ServicesList />
    </>
  );
}
