import { Card } from '@/components/ui/card';
import { Service } from '@/types';

const fakeServices: Service[] = [
  {
    id: 'service-1',
    name: 'Design de sobrancelha',
    durationMinutes: 60,
    price: 120,
    availableForBooking: true,
    createdAt: new Date().toISOString(),
  },
];

export function ServicesList() {
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold text-coffee-darkRoast">Serviços</h2>
      <ul className="space-y-2">
        {fakeServices.map((service) => (
          <li key={service.id} className="rounded-xl border border-coffee-cappuccino bg-white p-3">
            <p className="font-medium text-coffee-darkRoast">{service.name}</p>
            <p className="text-sm text-coffee-espresso">{service.durationMinutes} min • R$ {service.price}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
