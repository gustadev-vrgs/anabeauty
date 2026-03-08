import { Card } from '@/components/ui/card';
import { Appointment } from '@/types';

const fakeAppointments: Appointment[] = [
  {
    id: '1',
    clientId: 'client-1',
    serviceId: 'service-1',
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 60 * 60000).toISOString(),
    price: 180,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function AppointmentsList() {
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold text-coffee-darkRoast">Próximos agendamentos</h2>
      <ul className="space-y-2">
        {fakeAppointments.map((appointment) => (
          <li key={appointment.id} className="rounded-xl border border-coffee-cappuccino bg-white p-3">
            <p className="font-medium text-coffee-darkRoast">Atendimento agendado</p>
            <p className="text-sm text-coffee-espresso">{new Date(appointment.startsAt).toLocaleString('pt-BR')}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
