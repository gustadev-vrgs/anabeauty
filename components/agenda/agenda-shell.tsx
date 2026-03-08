'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Calendar } from './calendar';
import { DaySlots } from './day-slots';
import { useAuthGuard } from './use-auth-guard';
import { Button } from '@/components/common/button';
import { Card } from '@/components/common/card';
import { Input } from '@/components/common/input';
import { formatDateLabel, toDateKey } from '@/lib/domain/date';
import {
  createAppointment,
  createBlock,
  createClient,
  createService,
  listAppointmentsByDate,
  listBlocksByDate,
  listClients,
  listServices,
  updateAppointment,
} from '@/lib/firebase/collections';
import { Appointment, Client, ProcedureCategory, ServiceProcedure, TimeBlock } from '@/types/domain';

const procedureOptions: ProcedureCategory[] = ['piercing', 'cabelo', 'maquiagem', 'sobrancelha', 'outros'];

export function AgendaShell() {
  const { user, loading, logout } = useAuthGuard();
  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');

  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<ServiceProcedure[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceCategory, setServiceCategory] = useState<ProcedureCategory>('cabelo');

  const [appointmentClientId, setAppointmentClientId] = useState('');
  const [appointmentServiceId, setAppointmentServiceId] = useState('');
  const [appointmentPrice, setAppointmentPrice] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  const [blockReason, setBlockReason] = useState('');

  const dateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  async function loadReferences() {
    const [loadedClients, loadedServices] = await Promise.all([listClients(), listServices()]);
    setClients(loadedClients);
    setServices(loadedServices);
  }

  async function loadDay() {
    const [loadedAppointments, loadedBlocks] = await Promise.all([
      listAppointmentsByDate(dateKey),
      listBlocksByDate(dateKey),
    ]);
    setAppointments(loadedAppointments);
    setBlocks(loadedBlocks);
  }

  useEffect(() => {
    void loadReferences();
  }, []);

  useEffect(() => {
    void loadDay();
  }, [dateKey]);

  async function handleCreateClient(event: FormEvent) {
    event.preventDefault();
    if (!clientName || !clientPhone) return;
    await createClient({ name: clientName, phone: clientPhone });
    setClientName('');
    setClientPhone('');
    await loadReferences();
  }

  async function handleCreateService(event: FormEvent) {
    event.preventDefault();
    if (!serviceName) return;
    await createService({ name: serviceName, category: serviceCategory, durationInMinutes: 60, basePrice: 150 });
    setServiceName('');
    await loadReferences();
  }

  async function handleCreateAppointment(event: FormEvent) {
    event.preventDefault();
    if (!selectedSlot || !appointmentClientId || !appointmentServiceId) return;

    const start = new Date(`${dateKey}T${selectedSlot}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    await createAppointment({
      clientId: appointmentClientId,
      serviceId: appointmentServiceId,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      price: Number(appointmentPrice || 0),
      notes: appointmentNotes,
      status: 'confirmed',
    });

    setAppointmentNotes('');
    setAppointmentPrice('');
    await loadDay();
  }

  async function handleBlockSlot(event: FormEvent) {
    event.preventDefault();
    if (!selectedSlot) return;
    const start = new Date(`${dateKey}T${selectedSlot}:00`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    await createBlock({ startsAt: start.toISOString(), endsAt: end.toISOString(), reason: blockReason });
    setBlockReason('');
    await loadDay();
  }

  async function handleFinishAppointment(id: string) {
    await updateAppointment(id, { status: 'done' });
    await loadDay();
  }

  if (loading || !user) {
    return <main className="grid min-h-screen place-items-center">Carregando...</main>;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-3 sm:gap-6 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-card">
        <div>
          <h1 className="text-xl font-bold text-coffee-darkRoast sm:text-2xl">Agenda principal</h1>
          <p className="text-sm text-coffee-espresso">{formatDateLabel(selectedDate)}</p>
        </div>
        <Button onClick={() => void logout()}>Sair</Button>
      </header>

      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} monthDate={monthDate} onMonthChange={setMonthDate} />

      <DaySlots appointments={appointments} blocks={blocks} onSelectSlot={setSelectedSlot} />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-semibold text-coffee-darkRoast">Módulo: cadastro de clientes</h3>
          <form className="space-y-3" onSubmit={handleCreateClient}>
            <Input placeholder="Nome da cliente" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <Input placeholder="Telefone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
            <Button type="submit">Salvar cliente</Button>
          </form>
        </Card>

        <Card>
          <h3 className="mb-3 font-semibold text-coffee-darkRoast">Módulo: serviços/procedimentos</h3>
          <form className="space-y-3" onSubmit={handleCreateService}>
            <Input placeholder="Nome do serviço" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
            <select
              className="w-full rounded-xl border border-coffee-cappuccino px-3 py-2 text-sm"
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value as ProcedureCategory)}
            >
              {procedureOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Button type="submit">Salvar serviço</Button>
          </form>
        </Card>

        <Card>
          <h3 className="mb-3 font-semibold text-coffee-darkRoast">Módulo: agendamento</h3>
          <form className="space-y-3" onSubmit={handleCreateAppointment}>
            <p className="text-sm text-coffee-espresso">Horário selecionado: {selectedSlot || 'nenhum'}</p>
            <select
              value={appointmentClientId}
              onChange={(e) => setAppointmentClientId(e.target.value)}
              className="w-full rounded-xl border border-coffee-cappuccino px-3 py-2 text-sm"
            >
              <option value="">Selecione a cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>

            <select
              value={appointmentServiceId}
              onChange={(e) => setAppointmentServiceId(e.target.value)}
              className="w-full rounded-xl border border-coffee-cappuccino px-3 py-2 text-sm"
            >
              <option value="">Selecione o serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>

            <Input
              placeholder="Valor"
              inputMode="decimal"
              value={appointmentPrice}
              onChange={(e) => setAppointmentPrice(e.target.value)}
            />
            <Input placeholder="Observações" value={appointmentNotes} onChange={(e) => setAppointmentNotes(e.target.value)} />
            <Button type="submit">Criar agendamento</Button>
          </form>
        </Card>

        <Card>
          <h3 className="mb-3 font-semibold text-coffee-darkRoast">Módulo: bloqueio de horários</h3>
          <form className="space-y-3" onSubmit={handleBlockSlot}>
            <p className="text-sm text-coffee-espresso">Horário selecionado: {selectedSlot || 'nenhum'}</p>
            <Input placeholder="Motivo do bloqueio" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} />
            <Button type="submit">Bloquear horário</Button>
          </form>
        </Card>
      </section>

      <Card>
        <h3 className="mb-3 font-semibold text-coffee-darkRoast">Procedimentos marcados no dia</h3>
        <ul className="space-y-2">
          {appointments.length === 0 ? <li className="text-sm text-coffee-espresso">Sem agendamentos neste dia.</li> : null}
          {appointments.map((appointment) => {
            const client = clients.find((item) => item.id === appointment.clientId);
            const service = services.find((item) => item.id === appointment.serviceId);
            return (
              <li key={appointment.id} className="rounded-xl border border-coffee-cappuccino p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-coffee-darkRoast">{client?.name || 'Cliente'}</p>
                    <p className="text-sm text-coffee-espresso">{service?.name || 'Procedimento'} • {appointment.startsAt.slice(11, 16)}</p>
                    <p className="text-sm text-coffee-hazelnut">R$ {appointment.price.toFixed(2)}</p>
                  </div>
                  <Button
                    className="bg-coffee-espresso hover:bg-coffee-darkRoast"
                    onClick={() => void handleFinishAppointment(appointment.id)}
                  >
                    Marcar como concluído
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="border-2 border-dashed border-coffee-cappuccino bg-coffee-latte">
        <h3 className="font-semibold text-coffee-darkRoast">Dashboard financeiro (futuro)</h3>
        <p className="text-sm text-coffee-espresso">Estrutura reservada para métricas de faturamento e indicadores.</p>
      </Card>
    </main>
  );
}
