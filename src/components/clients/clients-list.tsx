'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Client } from '@/types';

type ClientFormData = {
  name: string;
  phone: string;
  email: string;
  instagram: string;
  notes: string;
  address: string;
  birthDate: string;
};

const initialFormData: ClientFormData = {
  name: '',
  phone: '',
  email: '',
  instagram: '',
  notes: '',
  address: '',
  birthDate: '',
};

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
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);

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

  const openNewClientModal = () => {
    setEditingClientId(null);
    setFormData(initialFormData);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditClientModal = (client: Client) => {
    setEditingClientId(client.id);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email ?? '',
      instagram: client.instagram ?? '',
      notes: client.notes ?? '',
      address: client.address ?? '',
      birthDate: client.birthDate ?? '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClientId(null);
    setFormError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError('Nome e telefone são obrigatórios.');
      return;
    }

    const payload: Omit<Client, 'id' | 'createdAt'> = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      instagram: formData.instagram.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      address: formData.address.trim() || undefined,
      birthDate: formData.birthDate || undefined,
    };

    if (editingClientId) {
      setClients((previous) =>
        previous.map((client) =>
          client.id === editingClientId ? { ...client, ...payload } : client,
        ),
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

      <div className="hidden overflow-hidden rounded-xl border border-coffee-cappuccino md:block">
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

      <ul className="space-y-3 md:hidden">
        {filteredClients.map((client) => (
          <li
            key={client.id}
            className="space-y-2 rounded-xl border border-coffee-cappuccino bg-white/85 p-4 shadow-sm"
          >
            <div>
              <p className="font-semibold text-coffee-darkRoast">{client.name}</p>
              <p className="text-sm text-coffee-espresso">{client.phone}</p>
            </div>
            {client.email ? <p className="text-sm text-coffee-espresso">{client.email}</p> : null}
            {client.instagram ? <p className="text-sm text-coffee-espresso">{client.instagram}</p> : null}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEditClientModal(client)}>
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
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

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingClientId ? 'Editar cliente' : 'Novo cliente'}
        description="Preencha os dados da cliente para salvar no cadastro."
      >
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Nome *"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Nome completo"
            required
          />
          <Input
            label="Telefone *"
            value={formData.phone}
            onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="(11) 99999-9999"
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="cliente@email.com"
          />
          <Input
            label="Instagram"
            value={formData.instagram}
            onChange={(event) => setFormData((prev) => ({ ...prev, instagram: event.target.value }))}
            placeholder="@usuario"
          />
          <Input
            label="Data de nascimento"
            type="date"
            value={formData.birthDate}
            onChange={(event) => setFormData((prev) => ({ ...prev, birthDate: event.target.value }))}
          />
          <Input
            label="Endereço"
            value={formData.address}
            onChange={(event) => setFormData((prev) => ({ ...prev, address: event.target.value }))}
            placeholder="Rua, número, cidade"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-coffee-darkRoast" htmlFor="observacoes-cliente">
              Observações
            </label>
            <textarea
              id="observacoes-cliente"
              className="min-h-20 w-full rounded-xl border border-border bg-coffee-latte px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-coffee-espresso focus:outline-none focus:ring-2 focus:ring-coffee-cappuccino/60"
              value={formData.notes}
              onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Preferências, restrições ou observações importantes"
            />
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <div className="flex justify-end">
            <Button type="submit">{editingClientId ? 'Salvar alterações' : 'Cadastrar cliente'}</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
