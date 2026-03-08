import { Card } from '@/components/ui/card';
import { Client } from '@/types';

const fakeClients: Client[] = [
  {
    id: 'client-1',
    name: 'Maria Clara',
    phone: '(11) 99999-0000',
    email: 'maria@example.com',
    createdAt: new Date().toISOString(),
  },
];

export function ClientsList() {
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold text-coffee-darkRoast">Clientes</h2>
      <ul className="space-y-2">
        {fakeClients.map((client) => (
          <li key={client.id} className="rounded-xl border border-coffee-cappuccino bg-white p-3">
            <p className="font-medium text-coffee-darkRoast">{client.name}</p>
            <p className="text-sm text-coffee-espresso">{client.phone}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
