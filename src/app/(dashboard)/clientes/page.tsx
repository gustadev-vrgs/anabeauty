import { ClientsList } from '@/components/clients/clients-list';
import { PageTitle } from '@/components/ui/page-title';

export default function ClientesPage() {
  return (
    <>
      <PageTitle
        title="Clientes"
        subtitle="Lista de clientes"
      />
      <ClientsList />
    </>
  );
}
