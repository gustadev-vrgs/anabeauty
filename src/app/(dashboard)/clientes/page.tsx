import { ClientsList } from '@/components/clients/clients-list';
import { PageTitle } from '@/components/ui/page-title';

export default function ClientesPage() {
  return (
    <>
      <PageTitle
        title="Clientes"
        subtitle="Cadastre, busque e gerencie sua base de clientes em poucos cliques."
      />
      <ClientsList />
    </>
  );
}
