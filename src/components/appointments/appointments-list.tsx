import { Card } from '@/components/ui/card';
import { Appointment } from '@/types';

const fakeAppointments: Appointment[] = [
  {
    id: '1',
    clientId: 'client-1',
    clientName: 'Maria Clara',
    serviceId: 'service-1',
    serviceName: 'Design de sobrancelha',
    date: '2026-03-09',
    startTime: '09:00',
    endTime: '10:00',
    durationMinutes: 60,
    price: 180,
    status: 'agendado',
    createdAt: new Date().toISOString(),
  },
];

export function AppointmentsList() {
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold text-coffee-darkRoast">Próximos agendamentos</h2>
      <ul className="space-y-2">
        {fakeAppointments.map((appointment) => (
          <li key={appointment.id} className="rounded-xl border border-coffee-cappuccino bg-white p-3">
            <p className="font-medium text-coffee-darkRoast">{appointment.clientName}</p>
            <p className="text-sm text-coffee-espresso">
              {appointment.date} às {appointment.startTime}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
