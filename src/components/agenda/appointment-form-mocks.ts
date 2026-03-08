import type { AppointmentClient, AppointmentService } from '@/components/agenda/appointment-form-types';

export const mockAppointmentServices: AppointmentService[] = [
  {
    id: 'srv-corte-escova',
    name: 'Corte + Escova',
    durationMinutes: 60,
    price: 180,
  },
  {
    id: 'srv-coloracao-raiz',
    name: 'Coloração Raiz',
    durationMinutes: 90,
    price: 240,
  },
  {
    id: 'srv-manicure-completa',
    name: 'Manicure Completa',
    durationMinutes: 60,
    price: 85,
  },
  {
    id: 'srv-sobrancelhas',
    name: 'Design de Sobrancelhas',
    durationMinutes: 45,
    price: 70,
  },
];

export const mockAppointmentClients: AppointmentClient[] = [
  {
    id: 'clt-mariana-alves',
    name: 'Mariana Alves',
    phone: '(11) 97777-1111',
  },
  {
    id: 'clt-carla-menezes',
    name: 'Carla Menezes',
    phone: '(11) 97777-2222',
  },
  {
    id: 'clt-sofia-martins',
    name: 'Sofia Martins',
    phone: '(11) 97777-3333',
  },
  {
    id: 'clt-renata-lima',
    name: 'Renata Lima',
    phone: '(11) 97777-4444',
  },
];
