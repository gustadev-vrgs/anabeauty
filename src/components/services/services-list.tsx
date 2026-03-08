'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Service } from '@/types';
import { ServiceFormModal, type ServiceFormValues } from '@/components/services/service-form-modal';
import { createService, deleteService, listServices, updateService } from '@/services/firestore/services.firestore';
import { useCachedCollection } from '@/hooks/use-cached-collection';

const mockServices: Service[] = [
  {
    id: 'service-1',
    name: 'Limpeza de Pele Premium',
    price: 180,
    durationMinutes: 75,
    category: 'Estética Facial',
    description: 'Higienização profunda com extração e máscara calmante.',
    availableForBooking: true,
    createdAt: new Date().toISOString(),
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function ServicesList() {
  const { data: services, error, loading, updateCache } = useCachedCollection<Service>({
    cacheKey: 'services',
    loader: listServices,
    fallbackData: mockServices,
  });
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

  async function handleSubmitService(values: ServiceFormValues) {
    const payload: Omit<Service, 'id' | 'createdAt'> = {
      name: values.nome,
      price: Number(values.valor),
      durationMinutes: Number(values.duracaoMinutos),
      category: values.categoria,
      description: values.descricao || undefined,
      availableForBooking: values.availableForBooking,
      imageUrl: values.imageUrl || undefined,
    };

    if (editingServiceId) {
      await updateService(editingServiceId, payload);
      updateCache((previous) => previous.map((service) => (service.id === editingServiceId ? { ...service, ...payload } : service)));
      return;
    }

    const newService: Service = {
      id: `service-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...payload,
    };

    await createService(newService);
    updateCache((previous) => [newService, ...previous]);
  }

  async function handleDeleteService(serviceId: string) {
    await deleteService(serviceId);
    updateCache((previous) => previous.filter((service) => service.id !== serviceId));
  }

  return (
    <Card className="space-y-5 bg-coffee-latte/55">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar serviço por nome" aria-label="Buscar serviço" className="sm:max-w-sm" />
        <Button onClick={() => { setEditingServiceId(null); setIsModalOpen(true); }} className="w-full bg-coffee-mocha text-coffee-cream hover:bg-coffee-espresso sm:w-auto">
          Novo Serviço
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
        {filteredServices.map((service) => (
          <li key={service.id} className="space-y-3 rounded-2xl border border-coffee-cappuccino bg-white/90 p-4 shadow-sm">
            <div className="space-y-1">
              <p className="font-semibold text-coffee-darkRoast">{service.name}</p>
              <p className="text-sm text-coffee-espresso">{service.category}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-coffee-blackCoffee">
              <span>{formatCurrency(service.price)}</span>
              <span>{service.durationMinutes} min</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => { setEditingServiceId(service.id); setIsModalOpen(true); }} className="min-h-11 flex-1">
                Editar
              </Button>
              <Button variant="destructive" onClick={() => void handleDeleteService(service.id)} className="min-h-11 flex-1">
                Excluir
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {!loading && !filteredServices.length ? (
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
                nome: editingService.name,
                categoria: editingService.category ?? '',
                valor: String(editingService.price),
                duracaoMinutos: String(editingService.durationMinutes),
                descricao: editingService.description ?? '',
                availableForBooking: editingService.availableForBooking,
                imageUrl: editingService.imageUrl ?? '',
              }
            : undefined
        }
        onClose={() => {
          setIsModalOpen(false);
          setEditingServiceId(null);
        }}
        onSubmit={handleSubmitService}
      />
    </Card>
  );
}
