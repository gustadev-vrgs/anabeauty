'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Service } from '@/types';
import { ServiceFormModal, type ServiceFormValues } from '@/components/services/service-form-modal';

const mockServices: Service[] = [
  {
    id: 'service-1',
    name: 'Limpeza de Pele Premium',
    price: 180,
    durationMinutes: 75,
    category: 'Estética Facial',
    description: 'Higienização profunda com extração e máscara calmante.',
    availableForBooking: true,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'service-2',
    name: 'Design de Sobrancelhas',
    price: 70,
    durationMinutes: 40,
    category: 'Olhar',
    description: 'Mapeamento e definição personalizada.',
    availableForBooking: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'service-3',
    name: 'Hidratação Capilar Intensiva',
    price: 150,
    durationMinutes: 60,
    category: 'Cabelos',
    description: 'Tratamento nutritivo para reconstrução da fibra.',
    availableForBooking: false,
    createdAt: new Date().toISOString(),
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function ServicesList() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return services;
    }

    return services.filter((service) => service.name.toLowerCase().includes(query));
  }, [services, search]);

  const editingService = useMemo(
    () => services.find((service) => service.id === editingServiceId) ?? null,
    [services, editingServiceId],
  );

  function openNewServiceModal() {
    setEditingServiceId(null);
    setIsModalOpen(true);
  }

  function openEditServiceModal(service: Service) {
    setEditingServiceId(service.id);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingServiceId(null);
  }

  function handleSubmitService(values: ServiceFormValues) {
    const payload: Omit<Service, 'id' | 'createdAt'> = {
      name: values.name,
      price: Number(values.price),
      durationMinutes: Number(values.durationMinutes),
      category: values.category,
      description: values.description || undefined,
      availableForBooking: values.availableForBooking,
      imageUrl: values.imageUrl || undefined,
    };

    if (editingServiceId) {
      setServices((previous) =>
        previous.map((service) => (service.id === editingServiceId ? { ...service, ...payload } : service)),
      );
    } else {
      const newService: Service = {
        id: `service-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...payload,
      };

      setServices((previous) => [newService, ...previous]);
    }

    closeModal();
  }

  function handleDeleteService(serviceId: string) {
    setServices((previous) => previous.filter((service) => service.id !== serviceId));
  }

  return (
    <Card className="space-y-5 bg-coffee-latte/55">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar serviço por nome"
          aria-label="Buscar serviço"
          className="sm:max-w-sm"
        />
        <Button onClick={openNewServiceModal} className="w-full bg-coffee-mocha text-coffee-cream hover:bg-coffee-espresso sm:w-auto">
          Novo Serviço
        </Button>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-coffee-cappuccino md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-coffee-cappuccino/65 text-coffee-darkRoast">
            <tr>
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">Valor</th>
              <th className="px-4 py-3 font-semibold">Duração</th>
              <th className="px-4 py-3 font-semibold">Categoria</th>
              <th className="px-4 py-3 font-semibold">Disponível</th>
              <th className="px-4 py-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white/85">
            {filteredServices.map((service) => (
              <tr key={service.id} className="border-t border-coffee-cappuccino/70 text-coffee-blackCoffee">
                <td className="px-4 py-3 font-medium">{service.name}</td>
                <td className="px-4 py-3">{formatCurrency(service.price)}</td>
                <td className="px-4 py-3">{service.durationMinutes} min</td>
                <td className="px-4 py-3">{service.category || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      service.availableForBooking
                        ? 'bg-coffee-cappuccino/70 text-coffee-darkRoast'
                        : 'bg-coffee-blackCoffee/10 text-coffee-espresso'
                    }`}
                  >
                    {service.availableForBooking ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => openEditServiceModal(service)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
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
        {filteredServices.map((service) => (
          <li key={service.id} className="space-y-3 rounded-xl border border-coffee-cappuccino bg-white/90 p-4 shadow-sm">
            <div className="space-y-1">
              <p className="font-semibold text-coffee-darkRoast">{service.name}</p>
              <p className="text-sm text-coffee-espresso">{service.category}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-coffee-blackCoffee">
              <span>{formatCurrency(service.price)}</span>
              <span>{service.durationMinutes} min</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-coffee-espresso">
              {service.availableForBooking ? 'Disponível para agendamento' : 'Indisponível para agendamento'}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => openEditServiceModal(service)} className="flex-1">
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)} className="flex-1">
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {!filteredServices.length ? (
        <p className="rounded-xl border border-dashed border-coffee-cappuccino bg-white/80 p-4 text-center text-sm text-coffee-espresso">
          Nenhum serviço encontrado para a busca informada.
        </p>
      ) : null}

      <ServiceFormModal
        open={isModalOpen}
        mode={editingService ? 'edit' : 'create'}
        initialValues={
          editingService
            ? {
                name: editingService.name,
                category: editingService.category ?? '',
                price: String(editingService.price),
                durationMinutes: String(editingService.durationMinutes),
                description: editingService.description ?? '',
                availableForBooking: editingService.availableForBooking,
                imageUrl: editingService.imageUrl ?? '',
              }
            : undefined
        }
        onClose={closeModal}
        onSubmit={handleSubmitService}
      />
    </Card>
  );
}
