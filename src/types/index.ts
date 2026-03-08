export type UserRole = 'admin' | 'professional';

export type AppointmentStatus = 'agendado' | 'concluido' | 'cancelado';

export type TimeBlockType = 'horario_unico' | 'intervalo' | 'dia_inteiro';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  instagram?: string;
  notes?: string;
  address?: string;
  birthDate?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  category?: string;
  description?: string;
  availableForBooking: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface TimeBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  blockType: TimeBlockType;
  reason?: string;
  notes?: string;
  createdAt: string;
}

export const firestoreDocumentExamples = {
  users: {
    id: 'usr_ana_001',
    name: 'Ana Beatriz',
    email: 'ana@anabeauty.com',
    role: 'admin',
    createdAt: '2026-03-08T10:00:00.000Z',
  } satisfies User,
  clients: {
    id: 'clt_maria_001',
    name: 'Maria Souza',
    phone: '+55 11 98888-7777',
    email: 'maria@email.com',
    instagram: '@mariasouza',
    notes: 'Prefere atendimento pela manhã.',
    address: 'Rua das Flores, 100 - São Paulo/SP',
    birthDate: '1994-09-14',
    createdAt: '2026-03-08T10:15:00.000Z',
  } satisfies Client,
  services: {
    id: 'srv_corte_fem_001',
    name: 'Corte Feminino',
    price: 120,
    durationMinutes: 60,
    category: 'Cabelo',
    description: 'Corte personalizado com finalização.',
    availableForBooking: true,
    imageUrl: 'https://example.com/images/corte-feminino.jpg',
    createdAt: '2026-03-08T10:20:00.000Z',
  } satisfies Service,
  appointments: {
    id: 'apt_20260310_0900',
    clientId: 'clt_maria_001',
    clientName: 'Maria Souza',
    serviceId: 'srv_corte_fem_001',
    serviceName: 'Corte Feminino',
    date: '2026-03-10',
    startTime: '09:00',
    endTime: '10:00',
    durationMinutes: 60,
    price: 120,
    status: 'agendado',
    notes: 'Trazer referência de corte.',
    createdAt: '2026-03-08T10:30:00.000Z',
  } satisfies Appointment,
  timeBlocks: {
    id: 'tbl_20260310_lunch',
    date: '2026-03-10',
    startTime: '12:00',
    endTime: '13:00',
    blockType: 'intervalo',
    reason: 'Almoço',
    notes: 'Sem encaixes nesse horário.',
    createdAt: '2026-03-08T10:35:00.000Z',
  } satisfies TimeBlock,
};
