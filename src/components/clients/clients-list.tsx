'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from '@/types';
import { ClientFormModal, type ClientFormValues } from '@/components/clients/client-form-modal';

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
  {
    id: 'client-2',
    name: 'Fernanda Lima',
    phone: '(11) 98888-1234',
    email: 'fernanda@example.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'client-3',
    name: 'Juliana Santos',
    phone: '(11) 97777-4567',
    instagram: '@ju.santos',
    createdAt: new Date().toISOString(),
  },
];

export function ClientsList() {
  const [clients, setClients] = useState<Client[]>(mockClients);
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

  const openNewClientModal = () => {
    setEditingClientId(null);
    setIsModalOpen(true);
  };

  const openEditClientModal = (client: Client) => {
    setEditingClientId(client.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClientId(null);
  };

  const handleSubmitClient = (values: ClientFormValues) => {
    const payload: Omit<Client, 'id' | 'createdAt'> = {
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      instagram: values.instagram || undefined,
      notes: values.notes || undefined,
      address: values.address || undefined,
      birthDate: values.birthDate || undefined,
    };

    if (editingClientId) {
      setClients((previous) =>
        previous.map((client) => (client.id === editingClientId ? { ...client, ...payload } : client)),
      );
    } else {
      const newClient: Client = {
        id: `client-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...payload,
      };

      setClients((previous) => [newClient, ...previous]);
    }

    closeModal();
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((previous) => previous.filter((client) => client.id !== clientId));
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
        <Button onClick={openNewClientModal} className="w-full sm:w-auto">
          Novo Cliente
        </Button>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-coffee-cappuccino lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-coffee-cappuccino/65 text-coffee-darkRoast">
            <tr>
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">Telefone</th>
              <th className="px-4 py-3 font-semibold">Contato</th>
              <th className="px-4 py-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white/70">
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-t border-coffee-cappuccino/70 text-coffee-blackCoffee">
                <td className="px-4 py-3 font-medium">{client.name}</td>
                <td className="px-4 py-3">{client.phone}</td>
                <td className="px-4 py-3">{client.email || client.instagram || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => openEditClientModal(client)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClient(client.id)}>
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 lg:hidden">
        {filteredClients.map((client) => (
          <li
            key={client.id}
            className="space-y-3 rounded-2xl border border-coffee-cappuccino bg-white/90 p-4 shadow-sm"
          >
            <div>
              <p className="font-semibold text-coffee-darkRoast">{client.name}</p>
              <p className="text-sm text-coffee-espresso">{client.phone}</p>
            </div>
            {client.email ? <p className="text-sm text-coffee-espresso">{client.email}</p> : null}
            {client.instagram ? <p className="text-sm text-coffee-espresso">{client.instagram}</p> : null}
            <div className="flex gap-2">
              <Button variant="secondary" className="min-h-11 flex-1" onClick={() => openEditClientModal(client)}>
                Editar
              </Button>
              <Button
                variant="destructive"
                className="min-h-11 flex-1"
                onClick={() => handleDeleteClient(client.id)}
              >
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {!filteredClients.length ? (
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
