import { ClientsList } from '@/components/clients/clients-list';
import { PageTitle } from '@/components/ui/page-title';

export default function ClientesPage() {
  return (
    <>
      <PageTitle title="Clientes" subtitle="Base inicial para cadastro e gestão de clientes." />
      <ClientsList />
    </>
  );
}
