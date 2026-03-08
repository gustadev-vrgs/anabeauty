'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from '@/types';
import { ClientFormModal, type ClientFormValues } from '@/components/clients/client-form-modal';
import { createClient, deleteClient, listClients, updateClient } from '@/services/firestore/clients.firestore';
import { useCachedCollection } from '@/hooks/use-cached-collection';
import { sanitizeClientPayload } from '@/lib/security/validators';

const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Maria Clara',
    phone: '(11) 99999-0000',
    email: 'maria@example.com',
    instagram: '@mariaclara',
    notes: 'Prefere horários pela manhã.',
    address: 'Rua das Flores, 100 - São Paulo/SP',
    birthDate: '1995-04-12',
    createdAt: new Date().toISOString(),
  },
];

export function ClientsList() {
  const { data: clients, error, loading, updateCache } = useCachedCollection<Client>({
    cacheKey: 'clients',
    loader: listClients,
    fallbackData: mockClients,
  });
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return clients;
    }

    const normalizedPhoneQuery = query.replace(/\D/g, '');

    return clients.filter((client) => {
      const byName = client.name.toLowerCase().includes(query);
      const byPhone = client.phone.replace(/\D/g, '').includes(normalizedPhoneQuery);
      return byName || byPhone;
    });
  }, [clients, search]);

  const editingClient = useMemo(
    () => clients.find((client) => client.id === editingClientId) ?? null,
    [clients, editingClientId],
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClientId(null);
  };

  const handleSubmitClient = async (values: ClientFormValues) => {
    const validation = sanitizeClientPayload({
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      instagram: values.instagram || undefined,
      notes: values.notes || undefined,
      address: values.address || undefined,
      birthDate: values.birthDate || undefined,
    });

    if (!validation.success) {
      throw new Error(validation.message);
    }

    if (editingClientId) {
      await updateClient(editingClientId, validation.data);
      updateCache((previous) => previous.map((client) => (client.id === editingClientId ? { ...client, ...validation.data } : client)));
      return;
    }

    const newClient: Client = {
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...validation.data,
    };

    await createClient(newClient);
    updateCache((previous) => [newClient, ...previous]);
  };

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    const confirmed = window.confirm(`Deseja excluir a cliente ${clientName}? Essa ação não pode ser desfeita.`);

    if (!confirmed) {
      return;
    }

    await deleteClient(clientId);
    updateCache((previous) => previous.filter((client) => client.id !== clientId));
  };

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome ou telefone"
          aria-label="Buscar cliente"
          className="sm:max-w-sm"
        />
        <Button onClick={() => { setEditingClientId(null); setIsModalOpen(true); }} className="w-full bg-coffee-mocha text-coffee-cream hover:bg-coffee-espresso sm:w-auto">
          Novo Cliente
        </Button>
      </div>

      {error ? <p className="text-sm text-coffee-espresso">{error}</p> : null}

      {loading ? (
        <div className="space-y-2">
          <div className="h-12 animate-pulse rounded-xl bg-coffee-cappuccino/40" />
          <div className="h-12 animate-pulse rounded-xl bg-coffee-cappuccino/30" />
        </div>
      ) : null}

      <ul className="space-y-3">
        {filteredClients.map((client) => (
          <li key={client.id} className="space-y-3 rounded-2xl border border-coffee-cappuccino bg-white/90 p-4 shadow-sm">
            <div>
              <p className="font-semibold text-coffee-darkRoast">{client.name}</p>
              <p className="text-sm text-coffee-espresso">{client.phone}</p>
            </div>
            {client.email ? <p className="text-sm text-coffee-espresso">{client.email}</p> : null}
            {client.instagram ? <p className="text-sm text-coffee-espresso">{client.instagram}</p> : null}
            <div className="flex gap-2">
              <Button variant="secondary" className="min-h-11 flex-1" onClick={() => { setEditingClientId(client.id); setIsModalOpen(true); }}>
                Editar
              </Button>
              <Button variant="destructive" className="min-h-11 flex-1" onClick={() => void handleDeleteClient(client.id, client.name)}>
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {!loading && !filteredClients.length ? (
        <p className="rounded-xl border border-dashed border-coffee-macchiato px-4 py-8 text-center text-sm text-coffee-espresso">
          Nenhuma cliente encontrada para esta busca.
        </p>
      ) : null}

      <ClientFormModal
        open={isModalOpen}
        mode={editingClient ? 'edit' : 'create'}
        initialValues={
          editingClient
            ? {
                name: editingClient.name,
                phone: editingClient.phone,
                email: editingClient.email ?? '',
                instagram: editingClient.instagram ?? '',
                notes: editingClient.notes ?? '',
                address: editingClient.address ?? '',
                birthDate: editingClient.birthDate ?? '',
              }
            : undefined
        }
        onClose={closeModal}
        onSubmit={handleSubmitClient}
      />
    </Card>
  );
}
